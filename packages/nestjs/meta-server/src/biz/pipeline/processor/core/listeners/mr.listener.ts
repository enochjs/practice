import { Injectable } from '@nestjs/common';
import { BaseListener } from './base.listener';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
  PIPELINE_PROCESSOR_ENUM,
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
    this.logger.log('checkNeedMerge', needMerge);
    let mr: any;
    if (needMerge) {
      mr = await this.gitService.createMergeRequest({
        projectId: 1,
        targetBranch: 'main',
        sourceBranch: 'dev',
      });
      if (mr.error) {
        // TODO send dingding message
      }
      this.logger.log('create mr error', mr);
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
    const pipeline = await this.pipelineService.findPipelineById(
      data.pipelineId,
    );
    this.logger.log('come in handleInprogress', pipeline);
    if (!pipeline || pipeline.status >= PIPELINE_BASE_STATUS_ENUM.TIMEOUT) {
      return;
    }

    const pipelineJob =
      await this.pipelineJobService.findByPipelineStageSeqAndJobKey(
        pipeline.id,
        pipeline.stageSeq!,
        data.jobKey,
      );

    this.logger.log('come in handleInprogress pipelineJob', pipelineJob);

    if (!pipelineJob || !pipelineJob.unitKey) {
      return;
    }

    const { iid } = parseGitlabPipelineJobUnitKey(pipelineJob.unitKey!);
    this.logger.log('come in handleInprogress iid', iid);

    const mergeInfo = await this.gitService.getMergeRequest({
      projectId: pipeline.repoId,
      iid: iid,
    });

    this.logger.log('come in handleInprogress mergeInfo', mergeInfo);

    const status = mergeInfo?.merge_status;

    let timeout: NodeJS.Timeout;
    const loop = async () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.pipelineProcessor.addQueue(
          PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
          {
            ...data,
            status: PIPELINE_BASE_STATUS_ENUM.IN_PROGRESS,
          },
        );
      }, 5000);
    };

    switch (status) {
      case 'cannot_be_merged':
        // TODO 无法合并，发送钉钉通知给相关人员
        loop();
        break;
      case 'can_be_merged':
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
        loop();
        break;
    }
  }

  @OnEventWrapper(PIPELINE_BASE_STATUS_ENUM.SUCCESS)
  async handleSuccess(data: any) {
    this.logger.log(
      'PIPELINE_MERGE_REQUEST PIPELINE_BASE_STATUS_ENUM.SUCCESS',
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
      'PIPELINE_MERGE_REQUEST PIPELINE_BASE_STATUS_ENUM.FAILED',
      data,
    );
    this.dispatchPipelineJob({
      ...data,
      success: false,
    });
  }
}
