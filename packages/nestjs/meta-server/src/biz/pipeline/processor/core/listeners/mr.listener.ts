import { Injectable } from '@nestjs/common';
import { BaseListener } from './base.listener';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
  PIPELINE_PROCESSOR_ENUM,
  SEPARATION,
} from '../constants';
import { ListenerWrapper, OnEventWrapper } from '../utils/decorator';
import { GitService } from '@/core/git/git.service';
import { ProcessJobForwardDto } from '../../dto/pipeline.processor.dto';
import {
  genGitlabPipelineJobUnitKey,
  parseGitlabPipelineJobUnitKey,
} from '../utils';

@Injectable()
@ListenerWrapper(PIPELINE_LISTENER_NAME_ENUM.PIPELINE_MERGE_REQUEST)
export class MergeRequestListener extends BaseListener {
  constructor(private readonly gitService: GitService) {
    super();
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.CREATE)
  async handleCreate(data: ProcessJobForwardDto) {
    this.logger.log('come in merge request', data);

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

    const needMerge = await this.gitService.checkNeedMerge({
      projectId: pipeline.repoId,
      targetBranch: 'main',
      sourceBranch: 'dev',
    });
    let mr: any;
    if (needMerge) {
      mr = await this.gitService.createMergeRequest({
        projectId: 1,
        targetBranch: 'main',
        sourceBranch: 'dev',
      });
      console.log('=====createMergeRequest', mr);
    }

    const result = await this.createPipelineJob({
      pipelineId: data.pipelineId,
      jobKey: data.jobKey,
      stageSeq: pipeline.stageSeq!,
      status: PIPELINE_BASE_STATUS_ENUM.CREATE,
      unitKey: genGitlabPipelineJobUnitKey(pipeline.repoId, mr?.iid),
      createTime: new Date(),
      updateTime: new Date(),
    });

    // 发起mr成功，设置job状态为inprogress, 触发轮询状态检查
    if (mr?.iid) {
      this.pipelineProcessor.addQueue(
        PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
        {
          ...data,
          pipelineJob: result,
          status: PIPELINE_BASE_STATUS_ENUM.IN_PROGRESS,
        },
      );
      return;
    }

    // 无需merge， 直接设置job成功
    this.pipelineProcessor.addQueue(
      PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
      {
        ...data,
        pipelineJob: result,
        status: PIPELINE_BASE_STATUS_ENUM.SUCCESS,
      },
    );
  }

  /**
   * 轮询check mr 是否能自动合并
   * @param data
   */
  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.IN_PROGRESS)
  async handleInprogress(data: ProcessJobForwardDto) {
    console.log('====come in merge inprogress====');
    const pipeline = await this.pipelineService.findPipelineById(
      data.pipelineId,
    );
    if (!pipeline || pipeline.status >= PIPELINE_BASE_STATUS_ENUM.TIMEOUT) {
      return;
    }

    const pipelineJob =
      await this.pipelineJobService.findByPipelineStageSeqAndJobKey(
        pipeline.id,
        pipeline.stageSeq!,
        data.jobKey,
      );

    if (!pipelineJob || pipelineJob.unitKey) {
      return;
    }

    const mergeInfo = await this.gitService.getMergeRequest({
      projectId: 1,
      iid: +pipelineJob!.unitKey!,
    });

    const status = mergeInfo?.merge_status;

    switch (status) {
      case 'cannot_be_merged':
        // TODO 无法合并，发送钉钉通知给相关人员
        break;
      case 'can_be_merged':
        const { iid } = parseGitlabPipelineJobUnitKey(pipelineJob.unitKey!);
        const result = await this.gitService.acceptMergeRequest({
          projectId: pipeline.repoId,
          iid: iid,
        });
        this.logger.log({
          acceptMR: result,
        });
        this.pipelineProcessor.addQueue(
          PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
          {
            ...data,
            status: PIPELINE_BASE_STATUS_ENUM.SUCCESS,
          },
        );
        break;
      default:
        setTimeout(() => {
          this.pipelineProcessor.addQueue(
            PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
            {
              ...data,
              status: PIPELINE_BASE_STATUS_ENUM.IN_PROGRESS,
            },
          );
        }, 5000);
    }
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.SUCCESS)
  async handleSuccess(data: any) {
    console.log('====come in merge success====');
    this.dispatchPipelineJob({
      ...data,
      success: true,
    });
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.FAILED)
  async handleFailed(data: any) {
    console.log('====come in merge failed====');
    // 写入数据库: 创建流水线
    this.dispatchPipelineJob({
      ...data,
      success: false,
    });
  }
}
