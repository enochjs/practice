import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePipelineDto {
  @ApiProperty({
    type: Number,
    description: '应用id',
  })
  @IsNumber()
  appId: number;

  @ApiProperty({
    type: Number,
    description: '迭代id',
  })
  @IsNumber()
  iterationId: number;

  @ApiProperty({
    type: Number,
    description: 'git repo id',
  })
  @IsNumber()
  repoId: number;

  @ApiProperty({
    type: Number,
    description: 'pipeline template id',
  })
  @IsNumber()
  tplId: number;

  @ApiProperty({
    type: String,
    description: 'pipeline template id',
  })
  @IsString()
  branch: string;

  @ApiProperty({
    type: String,
    description: 'pipeline template id',
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: 'object',
    description: '额外信息',
  })
  @IsOptional()
  extra: Record<string, any>;

  creator: number;
}
