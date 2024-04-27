import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import configuration from 'config/configuration';
import {
  DWClient,
  DWClientDownStream,
  EventAck,
} from '@/core/dd/streamSdk/client';

import { PipelineJobService } from './pipeline.job.service';
import { PipelineProcessor } from '../pipeline.processor';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_PROCESSOR_ENUM,
} from '../constants';
import { ProcessJobForwardDto } from '../../dto/pipeline.processor.dto';
import { PipelineService } from './pipeline.service';

@Injectable()
export class PipelineDdService {
  private appKey: string;
  private appSecret: string;
  private client: DWClient;

  constructor(
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
    private readonly logger: PinoLogger,
    private readonly pipelineJobService: PipelineJobService,
    private readonly pipelineProcessor: PipelineProcessor,
    private readonly pipelineService: PipelineService,
  ) {
    this.logger.setContext(PipelineDdService.name);
    const dd = this.configService.dd;
    this.appKey = dd.appKey;
    this.appSecret = dd.appSecret;
    this.initClient();
  }

  private async handleBpmsTaskChange(message: DWClientDownStream) {
    const { data } = message;
    const { processInstanceId, result } = JSON.parse(data);

    const getStatus = (result: string) => {
      switch (result) {
        case 'agree':
          return PIPELINE_BASE_STATUS_ENUM.SUCCESS;
        case 'refuse':
          return PIPELINE_BASE_STATUS_ENUM.FAILED;
        default:
          return null;
      }
    };

    const status = getStatus(result);

    // 只处理审批通过和审批拒绝
    if (!status) {
      return;
    }

    const pipelineJob =
      await this.pipelineJobService.findByUnitKey(processInstanceId);
    this.logger.info('=======pipelineJob, %j', pipelineJob);

    // 只处理由流水线发起的审批
    if (!pipelineJob) {
      this.logger.error('=======pipelineJob not found, %j', processInstanceId);
      return;
    }

    const pipeline = await this.pipelineService.findPipelineById(
      pipelineJob.pipelineId,
    );

    if (!pipeline) {
      this.logger.error(
        '=======pipeline not found, %j',
        pipelineJob.pipelineId,
      );
      return;
    }

    if (status) {
      await this.pipelineProcessor.addQueue<ProcessJobForwardDto>(
        PIPELINE_PROCESSOR_ENUM.PROCESS_JOB_FORWARD_EVENT,
        {
          pipelineId: pipelineJob.pipelineId,
          tplId: pipeline.tplId,
          jobKey: pipelineJob.jobKey,
          status,
        },
      );
    }
  }

  private initClient() {
    this.client = new DWClient({
      clientId: this.appKey,
      clientSecret: this.appSecret,
    });

    this.client
      .registerAllEventListener((message: DWClientDownStream) => {
        const { eventType } = message.headers;

        switch (eventType) {
          case 'bpms_task_change':
            this.handleBpmsTaskChange(message);
            break;
          default:
            break;
        }

        return { status: EventAck.SUCCESS };
      })
      .connect();
  }
}
