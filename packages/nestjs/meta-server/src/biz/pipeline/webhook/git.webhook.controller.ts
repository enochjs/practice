import { Body, Controller, Post } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PipelineJobService } from '../processor/core/services/pipeline.job.service';
import { genGitlabPipelineJobUnitKey } from '../processor/core/utils';
import { PipelineProcessor } from '../processor/core/pipeline.processor';
import {
  GIT_MR_STATUS_ENUM,
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_PROCESSOR_ENUM,
} from '../processor/core/constants';
import { ProcessJobForwardDto } from '../processor/dto/pipeline.processor.dto';
import { PipelineService } from '../processor/core/services/pipeline.service';

@Controller('api/pipeline/git')
export class GitWebhookController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly pipelineJobService: PipelineJobService,
    private readonly pipelineProcessor: PipelineProcessor,
    private readonly pipelineService: PipelineService,
  ) {
    this.logger.setContext(GitWebhookController.name);
  }

  private handleGitPipeline(body: any) {
    // todo
  }

  private async handleGitMerge(body: any) {
    const attribute = body.object_attributes;
    const project = body.project;
    if (!attribute || !project) {
      return;
    }
    this.logger.info(
      `api/hooks/git/pipeline git merge, state=${
        attribute.state
      }, attribute=${JSON.stringify(attribute)}`,
    );
    const pipelineJob = await this.pipelineJobService.findByUnitKey(
      genGitlabPipelineJobUnitKey(project.id, attribute.iid),
    );
    if (!pipelineJob) {
      return;
    }

    const pipeline = await this.pipelineService.findPipelineById(
      pipelineJob.pipelineId,
    );

    if (!pipeline) {
      return;
    }

    switch (attribute.state) {
      case GIT_MR_STATUS_ENUM.OPENED:
        if (attribute.merge_status === 'cannot_be_merged_recheck') {
          await this.pipelineProcessor.addQueue<ProcessJobForwardDto>(
            PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
            {
              pipelineId: pipelineJob.pipelineId,
              tplId: pipeline.tplId,
              jobKey: pipelineJob.jobKey,
              status: PIPELINE_BASE_STATUS_ENUM.IN_PROGRESS,
            },
          );
        }
        break;
      case GIT_MR_STATUS_ENUM.MERGED:
        await this.pipelineProcessor.addQueue<ProcessJobForwardDto>(
          PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
          {
            pipelineId: pipelineJob.pipelineId,
            tplId: pipeline.tplId,
            jobKey: pipelineJob.jobKey,
            status: PIPELINE_BASE_STATUS_ENUM.SUCCESS,
          },
        );
        break;

      case GIT_MR_STATUS_ENUM.CLOSED:
        await this.pipelineProcessor.addQueue<ProcessJobForwardDto>(
          PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
          {
            pipelineId: pipelineJob.pipelineId,
            tplId: pipeline.tplId,
            jobKey: pipelineJob.jobKey,
            status: PIPELINE_BASE_STATUS_ENUM.FAILED,
          },
        );
        break;
      default:
        break;
    }
  }

  @Post('/callback')
  async callback(@Body() body: any) {
    if (body.object_kind === 'pipeline') {
      this.handleGitPipeline(body);
    }
    if (body.object_kind === 'merge_request') {
      this.handleGitMerge(body);
    }
  }
}
