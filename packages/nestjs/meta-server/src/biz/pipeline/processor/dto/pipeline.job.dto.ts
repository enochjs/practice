import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
} from '../core/constants';
import { PartialType } from '@nestjs/swagger';

export class CreatePipelineJobDto {
  pipelineId: string;
  stageSeq: number;
  jobKey: PIPELINE_LISTENER_NAME_ENUM;
  status: PIPELINE_BASE_STATUS_ENUM;
  createTime?: Date;
  updateTime?: Date;
  unitKey: string;
  extra?: Record<string, any>;
}

export class ModifyPipelineJobDto extends PartialType(CreatePipelineJobDto) {
  id: string;
}
