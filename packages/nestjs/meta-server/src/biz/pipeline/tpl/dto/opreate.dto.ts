import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { PIPELINE_LISTENER_NAME_ENUM } from '../../processor/core/constants';

export class PipelineTplJobDto {
  @ApiProperty({
    type: String,
    description: 'job名称',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: '关联的job的key',
  })
  jobKey: PIPELINE_LISTENER_NAME_ENUM;

  @ApiProperty({
    type: Number,
    description: '额外信息',
  })
  extra: Record<string, any>;
}

export class PipelineTplStageDto {
  @ApiProperty({
    type: String,
    description: 'job名称',
  })
  name: string;

  @ApiProperty({
    type: Array<PipelineTplJobDto>,
    description: 'stage下的job',
  })
  jobs: PipelineTplJobDto[];
}

export class CreatePipelineTplDto {
  @ApiProperty({
    type: String,
    description: '流水线模版名称',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: Array<PipelineTplStageDto>,
    description: 'template下的stage',
  })
  stages: PipelineTplStageDto[];
  creator: number;
  updater: number;
}

export class ModifyPipelineTplDto extends PartialType(CreatePipelineTplDto) {
  @ApiProperty({
    type: Number,
    description: 'templateId',
  })
  @IsInt()
  id: number;
}
