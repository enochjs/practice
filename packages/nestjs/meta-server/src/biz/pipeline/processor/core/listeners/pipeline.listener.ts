import { Injectable } from '@nestjs/common';
import { BaseListener } from './base.listener';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
  PIPELINE_PROCESSOR_ENUM,
} from '../constants';
import { CreatePipelineDto } from '../../dto/pipeline.operate.dto';
import { ListenerWrapper, OnEventWrapper } from '../utils/decorator';

@Injectable()
@ListenerWrapper(PIPELINE_LISTENER_NAME_ENUM.PIPELINE)
export class PipelineListener extends BaseListener {
  constructor() {
    super();
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.CREATE)
  async handleCreate(data: CreatePipelineDto) {
    this.logger.log('pipeline listener create, %j', data);
    // 写入数据库: 创建流水线
    const pipeline = await this.pipelineService.createPipeline(data);
    // 执行流水线
    await this.pipelineProcessor.addQueue(
      PIPELINE_PROCESSOR_ENUM.PROCESS_STAGE_CREATE,
      {
        ...data,
        pipelineId: pipeline.id,
      },
    );
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.SUCCESS)
  async handleSuccess(data: CreatePipelineDto) {
    // 写入数据库: 创建流水线
    await this.pipelineService.createPipeline(data);
    // 执行流水线
    await this.pipelineProcessor.addQueue(
      PIPELINE_PROCESSOR_ENUM.PROCESS_STAGE_CREATE,
      data,
    );
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.CANCELED)
  async handleCanceled(data: CreatePipelineDto) {
    // 写入数据库: 创建流水线
    await this.pipelineService.createPipeline(data);
    // 执行流水线
    await this.pipelineProcessor.addQueue(
      PIPELINE_PROCESSOR_ENUM.PROCESS_STAGE_CREATE,
      data,
    );
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.FAILED)
  async handleFailed(data: CreatePipelineDto) {
    // 写入数据库: 创建流水线
    await this.pipelineService.createPipeline(data);
    // 执行流水线
    await this.pipelineProcessor.addQueue(
      PIPELINE_PROCESSOR_ENUM.PROCESS_STAGE_CREATE,
      data,
    );
  }
}
