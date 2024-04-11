import { Inject, Injectable } from '@nestjs/common';
import { PipelineProcessor } from '../pipeline.processor';
import { RobotService } from '@/core/robot';
import { UserService } from '@/biz/user/user.service';
import { PipelineJobService } from '../services/pipeline.job.service';
import { PipelineService } from '../services/pipeline.service';
import { PIPELINE_PROCESSOR_ENUM } from '../constants';
import { CreatePipelineJobDto } from '../../dto/pipeline.job.dto';
import { PipelineLogger } from '../utils/pipeline.logger';

@Injectable()
export class BaseListener {
  protected eventName: string;

  @Inject()
  protected readonly logger: PipelineLogger;

  @Inject()
  protected readonly pipelineProcessor: PipelineProcessor;

  @Inject()
  protected readonly robotService: RobotService;

  @Inject()
  protected readonly userService: UserService;

  @Inject()
  protected readonly pipelineService: PipelineService;

  @Inject()
  protected readonly pipelineJobService: PipelineJobService;

  async createPipelineJob(data: any) {
    const job = await this.pipelineJobService.createJob(data);
    this.logger.log({
      event: data.jobKey,
      job,
    });
    return job;
  }

  async dispatchPipelineJob(data: {
    pipelineId: string;
    jobKey: string;
    success: boolean;
    pipelineJob?: Partial<CreatePipelineJobDto>;
  }) {
    const { pipelineId, jobKey, success } = data;
    this.logger.log({
      method: 'dispatchPipelineJob',
      jobKey,
      data: data,
    });
    const pipeline = await this.pipelineService.getPipeline(pipelineId);

    if (!pipeline) {
      this.logger.error({
        method: 'dispatchPipelineJob',
        jobKey,
        pipelineId,
      });
      return;
    }
    // if (pipelineJob) {
    //   const pipelineJob = await this.pipelineJobService.findByParams({
    //     pipelineId: pipeline?.id,
    //     stageSeq: pipeline?.stage,
    //     jobKey,
    //   });
    //   this.logger.log({
    //     method: 'dispatchPsjs',
    //     jobKey,
    //     pipelineJob,
    //   });
    //   await this.pipelineJobService.updateJob({
    //     ...pipelineJob,
    //     // ...psjsData,
    //     extra: {
    //       ...psjs?.extra,
    //       // ...psjsData?.extra,
    //     },
    //   });
    // }
    await this.pipelineProcessor.addQueue<any>(
      PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_STATE_CHANGE,
      {
        pipelineId: pipeline.id,
        tplId: pipeline.tplId,
        stageSeq: pipeline.stageSeq,
        success,
        jobKey: jobKey,
      },
    );
  }
}
