import { CreatePipelineDto } from './pipeline.operate.dto';
import { PipelineTplJobDto } from '../../tpl/dto/opreate.dto';
import { PIPELINE_BASE_STATUS_ENUM } from '../core/constants';

export class ProcessStageCreateDto extends CreatePipelineDto {
  pipelineId: string;
}

export class ProcessDispatchStageDto {
  pipelineId: string;
  tplId: number;
}

export class ProcessJobForwardDto extends PipelineTplJobDto {
  pipelineId: string;
  tplId: number;
  status?: PIPELINE_BASE_STATUS_ENUM;
}

export class ProcessJobStateChangeDto extends ProcessJobForwardDto {
  success: boolean;
  stageSeq: number;
}
