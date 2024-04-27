import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pipeline } from '@/core/entities/pipeline/processor/pipeline.entity';
import { PipelineJob } from '@/core/entities/pipeline/processor/pipeline.job.entity';
import { PipelineController } from './processor/pipeline.controller';
import { PipelineTpl } from '@/core/entities/pipeline/template/pipeline.tpl.entity';
import { PipelineTplJob } from '@/core/entities/pipeline/template/pipeline.tpl.job.entity';
import { PipelineTplStage } from '@/core/entities/pipeline/template/pipeline.tpl.stage.entity';
import { PipelineTplService } from './tpl/pipeline.tpl.service';
import { PipelineTplController } from './tpl/pipeline.tpl.controller';
import { PipelineProcessor } from './processor/core/pipeline.processor';
import { PipelineService } from './processor/core/services/pipeline.service';
import { PipelineListener } from './processor/core/listeners/pipeline.listener';
import { BaseListener } from './processor/core/listeners/base.listener';
import { UserModule } from '../user/user.module';
import { PipelineJobService } from './processor/core/services/pipeline.job.service';
import { BuildListener } from './processor/core/listeners/build.listener';
import { DeployListener } from './processor/core/listeners/deploy';
import { MergeRequestListener } from './processor/core/listeners/mr.listener';
import { PipelineLogger } from './processor/core/utils/pipeline.logger';
import { DdWebhookController } from './webhook/dd.webhook.controller';
import { GitWebhookController } from './webhook/git.webhook.controller';
import { PipelineDdService } from './processor/core/services/pipeline.dd.service';
@Module({
  imports: [
    UserModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([
      Pipeline,
      PipelineJob,
      PipelineTpl,
      PipelineTplStage,
      PipelineTplJob,
    ]),
    BullModule.registerQueue({
      name: 'pipeline',
    }),
  ],
  controllers: [
    PipelineController,
    PipelineTplController,
    DdWebhookController,
    GitWebhookController,
  ],
  providers: [
    PipelineLogger,
    PipelineTplService,
    PipelineProcessor,
    PipelineService,
    PipelineDdService,
    BaseListener,
    PipelineListener,
    BuildListener,
    DeployListener,
    MergeRequestListener,
    PipelineJobService,
  ],
})
export class PipelineModule {}
