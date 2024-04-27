import { CreatePipelineDto } from './pipeline.operate.dto';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
} from '../core/constants';

export class ProcessStageCreateDto extends CreatePipelineDto {
  pipelineId: string;
}

export class ProcessDispatchStageDto {
  pipelineId: string;
  tplId: number;
}

export class ProcessJobForwardDto {
  jobKey: PIPELINE_LISTENER_NAME_ENUM;
  pipelineId: string;
  tplId: number;
  status?: PIPELINE_BASE_STATUS_ENUM;
}

export class ProcessJobStateChangeDto extends ProcessJobForwardDto {
  success: boolean;
  stageSeq: number;
}
