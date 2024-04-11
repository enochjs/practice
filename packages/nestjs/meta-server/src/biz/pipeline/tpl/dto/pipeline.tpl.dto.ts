import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

export class PipelineTplJobDto {
  @ApiProperty({
    type: 'number',
    description: 'pipeline template.stage.job id',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'job名称',
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: '所属stage的序列',
  })
  stageSeq: number;

  @ApiProperty({
    type: String,
    description: '关联的job的key',
  })
  jobKey: string;

  @ApiProperty({
    type: Number,
    description: '额外信息',
  })
  extra: Record<string, any>;
}

export class PipelineTplStageDto {
  @ApiProperty({
    type: 'number',
    description: 'pipeline template.stage id',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'job名称',
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: '所属template id',
  })
  tpl: number;

  @ApiProperty({
    type: Array<PipelineTplJobDto>,
    description: 'stage下的job',
  })
  jobs: PipelineTplJobDto[];
}

export class PipelineTplDto {
  @ApiProperty({
    type: 'number',
    description: 'id',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: '流水线模版名称',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: '创建时间',
  })
  createTime: moment.Moment;

  @ApiProperty({
    type: String,
    description: '更新时间',
  })
  updateTime: moment.Moment;

  @ApiProperty({
    type: Array<PipelineTplStageDto>,
    description: 'template下的stage',
  })
  stages: PipelineTplStageDto[];
}
