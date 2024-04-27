import { Body, Controller, Post } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PipelineJobService } from '../processor/core/services/pipeline.job.service';
import { genGitlabPipelineJobUnitKey } from '../processor/core/utils';

@Controller('api/pipeline/git')
export class GitWebhookController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly pipelineJobService: PipelineJobService,
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
    // const psjs = await this.psjsService.findByParams({
    //   repoId: project.id,
    //   iid: attribute.iid,
    //   jobKey: job_temp_enum.MERGE_REQUEST,
    // });
    // this.logger.info(
    //   `git merge psjs repoId=${project.id}, iid=${attribute.iid}, jobKey=${job_temp_enum.MERGE_REQUEST}, psjs=%j`,
    //   psjs,
    // );
    // if (!psjs) {
    //   // 非pipeline触发
    //   const iteration = await this.pipelineService.getIterationByBranch(
    //     attribute.target_branch,
    //   );

    //   // 分支对应的迭代有绑定自动发布模版
    //   if (
    //     iteration &&
    //     (iteration.status === iteration_status_enum.IN_PROGRESS ||
    //       iteration.status === iteration_status_enum.NOT_START) &&
    //     iteration.extra?.autoTemplates &&
    //     attribute?.state === git_mr_status_enum.MERGED
    //   ) {
    //     const tempConfigs: { configId?: number; templateId: number }[] = [];
    //     iteration.extra?.autoTemplates.forEach((t) => {
    //       if (t.selected) {
    //         if (t.configIds?.length) {
    //           t.configIds.forEach((c) => {
    //             tempConfigs.push({
    //               configId: c,
    //               templateId: t.templateId,
    //             });
    //           });
    //         } else {
    //           tempConfigs.push({
    //             templateId: t.templateId,
    //           });
    //         }
    //       }
    //     });
    //     tempConfigs?.forEach(async (template, index) => {
    //       const checkPipeline = await this.pipelineService.getActivePipeline(
    //         iteration.id,
    //         template.templateId,
    //         template.configId,
    //       );
    //       if (checkPipeline) {
    //         await this.pipelineProcessor.addPipelineQueue<PipelineJobEventJob>(
    //           pipeline_process_dispatch_event_controll,
    //           {
    //             eventName: `${job_temp_enum.PIPELINE_STATUS}:${pipeline_status_enum.CANCELED}`,
    //             pipelineId: checkPipeline.id,
    //           },
    //         );
    //       }
    //       setTimeout(
    //         async () => {
    //           const result =
    //             await this.pipelineProcessor.addPipelineQueue<PipelineStartJob>(
    //               pipeline_process_start_controll,
    //               {
    //                 iterationId: iteration.id,
    //                 templateId: template.templateId,
    //                 configId: template.configId,
    //                 content: 'auto-deploy',
    //                 force: false,
    //                 user: {
    //                   userId: iteration.owner,
    //                   name: iteration.ownerName,
    //                 },
    //               },
    //             );
    //           return result;
    //         },
    //         3000 * (index + 1),
    //       );
    //     });
    //   }
    //   return;
    // }

    // const job = await this.pipelineService.findJob(
    //   psjs.pipelineId,
    //   job_temp_enum.MERGE_REQUEST,
    // );

    // if (!job) {
    //   return;
    // }
    // if (attribute.state === git_mr_status_enum.MERGED) {
    //   this.pipelineProcessor.addPipelineQueue<PipelineJobEventJob>(
    //     pipeline_process_dispatch_event_controll,
    //     {
    //       eventName: `${job_temp_enum.MERGE_REQUEST}:${git_mr_status_enum.MERGED}`,
    //       repoId: project?.id,
    //       pipelineId: psjs.pipelineId,
    //       iid: attribute.iid,
    //     },
    //   );
    // }
    // if (attribute.state === git_mr_status_enum.CLOSED) {
    //   this.pipelineProcessor.addPipelineQueue<PipelineJobEventJob>(
    //     pipeline_process_dispatch_event_controll,
    //     {
    //       eventName: `${job_temp_enum.MERGE_REQUEST}:${git_mr_status_enum.MERGED}`,
    //       repoId: project?.id,
    //       pipelineId: psjs.pipelineId,
    //       iid: attribute.iid,
    //     },
    //   );
    // }
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
