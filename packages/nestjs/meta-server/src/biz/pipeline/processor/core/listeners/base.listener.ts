import { Inject, Injectable } from '@nestjs/common';
import { PipelineProcessor } from '../pipeline.processor';
import { RobotService } from '@/core/robot';
import { UserService } from '@/biz/user/user.service';
import { PipelineJobService } from '../services/pipeline.job.service';
import { PipelineService } from '../services/pipeline.service';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
  PIPELINE_PROCESSOR_ENUM,
} from '../constants';
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

  async createPipelineJob(data: CreatePipelineJobDto) {
    const job = await this.pipelineJobService.createJob(data);
    this.logger.log({
      event: data.jobKey,
      job,
    });
    return job;
  }

  async dispatchPipelineJob(data: {
    pipelineId: string;
    jobKey: PIPELINE_LISTENER_NAME_ENUM;
    success: boolean;
    pipelineJob?: Partial<CreatePipelineJobDto>;
  }) {
    const { pipelineId, jobKey, success } = data;
    this.logger.log({
      method: 'dispatchPipelineJob',
      jobKey,
      data: data,
    });
    const pipeline = await this.pipelineService.findPipelineById(pipelineId);

    if (!pipeline) {
      this.logger.error({
        method: 'dispatchPipelineJob',
        jobKey,
        pipelineId,
      });
      return;
    }
    const pipelineJob =
      await this.pipelineJobService.findByPipelineStageSeqAndJobKey(
        pipeline.id,
        pipeline.stageSeq,
        jobKey,
      );
    this.logger.log({
      method: 'dispatchPipelineJob',
      jobKey,
      pipelineJob,
    });
    if (!pipelineJob) {
      this.logger.error('pipeline job not found', data);
      return;
    }
    await this.pipelineJobService.updateJob({
      ...pipelineJob,
      ...data.pipelineJob,
      status: success
        ? PIPELINE_BASE_STATUS_ENUM.SUCCESS
        : PIPELINE_BASE_STATUS_ENUM.FAILED,
    });

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
