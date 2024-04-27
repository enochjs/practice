import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
  PIPELINE_PROCESSOR_ENUM,
  PIPELINE_PROCESSOR_NAME,
  // PIPELINE_TASK_STATUS_ENUM,
  SEPARATION,
} from './constants';
import { CreatePipelineDto } from '../dto/pipeline.operate.dto';
import { PipelineService } from './services/pipeline.service';
import { PipelineTplService } from '../../tpl/pipeline.tpl.service';
import { PipelineTplStage } from '@/core/entities/pipeline/template/pipeline.tpl.stage.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  ProcessDispatchStageDto,
  ProcessJobForwardDto,
  ProcessJobStateChangeDto,
  ProcessStageCreateDto,
} from '../dto/pipeline.processor.dto';
import { PipelineLogger } from './utils/pipeline.logger';
import {
  ProcessFunctionWrapper,
  ProcessorQueueJobWrapper,
} from './utils/decorator';
// pipeline 任务处理器，使用redis缓存队列
// 确保任务能够被执行，任务的状态有：未执行、执行中、执行成功、执行失败
// 所有的任务都会被加入到 pipeline 队列中，然后由 pipeline 处理器进行处理
// pipeline 处理器会根据任务的状态，执行对应的操作
// 任务状态变更会触发事件，事件会被监听器监听，然后执行对应的操作
// 动作 => 任务 => 事件 => 监听器 => 动作
@Processor('pipeline')
export class PipelineProcessor {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(PIPELINE_PROCESSOR_NAME)
    private readonly pipelineQueue: Queue,
    private readonly pipelineService: PipelineService,
    private readonly pipelineTplService: PipelineTplService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Inject()
  protected readonly logger: PipelineLogger;

  addQueue<T>(name: string, data: T) {
    return this.pipelineQueue.add(name, data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  emitEvent(
    eventName: PIPELINE_LISTENER_NAME_ENUM,
    status: PIPELINE_BASE_STATUS_ENUM,
    data: any,
  ) {
    this.eventEmitter.emitAsync(`${eventName}${SEPARATION}${status}`, data);
  }

  @ProcessFunctionWrapper
  private async dispatchStage(data: ProcessDispatchStageDto) {
    this.logger.log(`processor pipeline dispatch stage, %j`, data);
    const { tplId, pipelineId } = data;
    const pipeline = await this.pipelineService.findPipelineById(pipelineId);
    const tpl = await this.pipelineTplService.findById(tplId);
    if (!pipeline) {
      this.logger.error('流水线不存在');
      return;
    }
    if (!tpl) {
      this.logger.error('流水线模板或流水线不存在');
      // TODO send error msg
      return;
    }
    const nextStage = tpl.stages.find((stage) => {
      return stage.seq === pipeline.stageSeq + 1;
    });
    this.logger.log(
      'processor pipeline dispatch stage: nextStage, %j',
      nextStage,
    );

    if (nextStage) {
      await this.executeStage(data, nextStage);
      return;
    }
    // TODO
    console.log('pipeline finish');
    // send success event
  }

  private generatePipelineStageKey = (pipelineId: string, stageSeq: number) => {
    return `pipeline:stage:cache:${pipelineId}:${stageSeq}`;
  };

  @ProcessFunctionWrapper
  private async executeStage(
    data: ProcessDispatchStageDto,
    stage: PipelineTplStage,
  ) {
    this.logger.log(
      'processor pipeline execute stage, data, %j, stage, %j',
      data,
      stage,
    );
    const jobs = stage.jobs;
    const stageKey = this.generatePipelineStageKey(data.pipelineId, stage.seq);
    await this.pipelineService.modifyPipeline(data.pipelineId, {
      stageSeq: stage.seq,
    });
    // check stage 是否已经dispatch过
    const cacheValue = await this.cacheManager.get(stageKey);
    // 如果已经dispatch过，说明stage已经执行完成，无需再次触发
    if (cacheValue) {
      return;
    }
    const jobResult = {};
    await this.cacheManager.set(stageKey, jobResult, 7 * 24 * 60 * 60);
    if (jobs && jobs.length) {
      jobs.forEach((job) => {
        this.executeJob(
          {
            ...data,
            ...job,
          },
          job.jobKey,
        );
      });
    }
  }

  @ProcessFunctionWrapper
  private async executeJob(
    data: ProcessJobForwardDto,
    eventName: PIPELINE_LISTENER_NAME_ENUM,
  ) {
    this.logger.log(
      'processor pipeline execute job eventName=%s, data, %j',
      eventName,
      data,
    );
    const pipeline = await this.pipelineService.findPipelineById(
      data.pipelineId,
    );
    if (
      pipeline?.status === PIPELINE_BASE_STATUS_ENUM.SUCCESS ||
      pipeline?.status === PIPELINE_BASE_STATUS_ENUM.CANCELED
    ) {
      this.logger.log(
        'pipeline is success or canceled, do nothing, %j',
        pipeline,
      );
      return;
    }
    this.emitEvent(eventName, PIPELINE_BASE_STATUS_ENUM.CREATE, data);
  }

  @ProcessFunctionWrapper
  private async checkStageFinish(data: ProcessJobStateChangeDto) {
    const { pipelineId, tplId, stageSeq, success, jobKey } = data;
    const stageKey = this.generatePipelineStageKey(pipelineId, stageSeq);
    const jobResult: Record<string, boolean> = (await this.cacheManager.get(
      stageKey,
    )) as any;
    // jobResult 不存在，说明stage已经执行完成, dispatchNextStage 已经触发，无需二次触发
    if (!jobResult) {
      return false;
    }
    jobResult[jobKey] = success;
    this.logger.log(
      'processor pipeline checkStageFinish: jobResult=%j',
      jobResult,
    );
    const tpl = await this.pipelineTplService.findById(tplId);
    this.logger.log('processor pipeline checkStageFinish: tpl=%j', jobResult);
    const stage = tpl?.stages.find((item) => item.seq === stageSeq);
    await this.cacheManager.set(stageKey, jobResult, 7 * 24 * 60 * 60);
    if (
      Object.values(jobResult).filter((item) => item === true).length ===
      stage?.jobs.length
    ) {
      this.logger.log(
        'processor pipeline checkStageFinish: stage all job finish',
      );
      await this.cacheManager.del(stageKey);
      return true;
    }
    return false;
  }

  // 处理流水线创建事件
  @Process(PIPELINE_PROCESSOR_ENUM.PROCESS_PIPELINE_CREATE)
  @ProcessorQueueJobWrapper
  async processPipelineCreate(job: Job<CreatePipelineDto>) {
    this.logger.log('processor pipeline create, %j', job.data);
    this.emitEvent(
      PIPELINE_LISTENER_NAME_ENUM.PIPELINE,
      PIPELINE_BASE_STATUS_ENUM.CREATE,
      job.data,
    );
  }

  // 处理流水线stage创建事件
  @Process(PIPELINE_PROCESSOR_ENUM.PROCESS_STAGE_CREATE)
  @ProcessorQueueJobWrapper
  async processStageCreate(job: Job<ProcessStageCreateDto>) {
    this.logger.log('processor pipeline create stage, %j', job.data);
    await this.dispatchStage(job.data);
  }

  // 处理流水线执行过程中转发的job事件
  @Process(PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT)
  @ProcessorQueueJobWrapper
  async processJobForward(job: Job<ProcessJobForwardDto>) {
    const { data } = job;
    this.logger.log('processor pipeline job forward, %j', data);
    this.emitEvent(data.jobKey, data.status!, data);
  }

  // 处理流水线job状态变更事件
  @Process(PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_STATE_CHANGE)
  @ProcessorQueueJobWrapper
  async processJobStateChange(job: Job<ProcessJobStateChangeDto>) {
    this.logger.log('processor pipeline job state change, %j', job.data);
    const { pipelineId, tplId, success } = job.data;
    if (success) {
      const isFinish = await this.checkStageFinish(job.data);
      if (isFinish) {
        await this.dispatchStage({
          tplId,
          pipelineId,
        });
      }
    } else {
      this.logger.log(
        `logger_pipelineId=${pipelineId},PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_STATE_CHANGE failed`,
      );
      // TODO
      // send failed event
    }
  }
}
