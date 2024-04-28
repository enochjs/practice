import { Injectable } from '@nestjs/common';
import { BaseListener } from './base.listener';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
} from '../constants';
import { ListenerWrapper, OnEventWrapper } from '../utils/decorator';
import { DdService } from '@/core/dd/dd.service';
import { ProcessJobForwardDto } from '../../dto/pipeline.processor.dto';

@Injectable()
@ListenerWrapper(PIPELINE_LISTENER_NAME_ENUM.PIPELINE_DD_APPROVE)
export class DdApproveListener extends BaseListener {
  constructor(private readonly ddService: DdService) {
    super();
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.CREATE)
  async handleCreate(data: ProcessJobForwardDto) {
    this.logger.log('come in dd approve request', data);

    const instanceId = await this.ddService.createApproveInstance({
      appName: 'test',
      env: 'dev',
      version: '1.0.0',
      content: '测试发布',
      originatorUserId: 'manager1124',
      approveUserIds: ['manager1124'],
      approveType: 'OR',
    });

    const pipeline = await this.pipelineService.findPipelineById(
      data.pipelineId,
    );
    if (!pipeline) {
      this.logger.error({
        method: 'dispatchPipelineJob',
        jobKey: data.jobKey,
        pipelineId: data.pipelineId,
        message: 'pipeline not found',
      });
      return;
    }

    const result = await this.createPipelineJob({
      pipelineId: data.pipelineId,
      jobKey: data.jobKey,
      stageSeq: pipeline.stageSeq!,
      status: PIPELINE_BASE_STATUS_ENUM.CREATE,
      unitKey: instanceId,
      createTime: new Date(),
      updateTime: new Date(),
    });
    this.logger.log('create pipeline job success', result);
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.SUCCESS)
  async handleSuccess(data: any) {
    this.logger.log(
      'PIPELINE_DD_APPROVE PIPELINE_BASE_STATUS_ENUM.SUCCESS',
      data,
    );
    this.dispatchPipelineJob({
      ...data,
      success: true,
    });
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.FAILED)
  async handleFailed(data: any) {
    this.logger.log(
      'PIPELINE_DD_APPROVE PIPELINE_BASE_STATUS_ENUM.FAILED',
      data,
    );
    // 写入数据库: 创建流水线
    this.dispatchPipelineJob({
      ...data,
      success: false,
    });
  }
}
