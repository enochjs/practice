import { Injectable } from '@nestjs/common';
import { BaseListener } from './base.listener';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
  PIPELINE_PROCESSOR_ENUM,
} from '../constants';
import { ListenerWrapper, OnEventWrapper } from '../utils/decorator';

@Injectable()
@ListenerWrapper(PIPELINE_LISTENER_NAME_ENUM.PIPELINE_BUILD)
export class BuildListener extends BaseListener {
  constructor() {
    super();
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.CREATE)
  async handleCreate(data: any) {
    // 执行流水线
    this.logger.log('come in build', data);

    const result = await this.createPipelineJob({
      ...data,
      status: PIPELINE_BASE_STATUS_ENUM.SUCCESS,
    });
    // fake code
    setTimeout(async () => {
      // fake build success
      this.pipelineProcessor.addQueue(
        PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
        {
          ...data,
          pipelineJob: result,
          status: PIPELINE_BASE_STATUS_ENUM.SUCCESS,
        },
      );
    }, 3000);
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.SUCCESS)
  async handleSuccess(data: any) {
    console.log('====come in build success====');
    this.dispatchPipelineJob({
      ...data,
      success: true,
    });
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.FAILED)
  async handleFailed(data: any) {
    console.log('====come in build failed====');
    // 写入数据库: 创建流水线
    this.dispatchPipelineJob({
      ...data,
      success: false,
    });
  }
}
