// 需求迭代表
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
} from '@/biz/pipeline/processor/core/constants';
import { dateFormat } from '@/utils/transform';
import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('pipeline_job')
@Index('idx_pj', ['pipelineId', 'stageSeq', 'jobKey'], {
  unique: true,
})
export class PipelineJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { comment: 'pipelineId' })
  pipelineId: string;

  @Column('int', { comment: 'stage 序列号' })
  stageSeq: number;

  @Column('varchar', { length: 64, comment: 'job key' })
  jobKey: PIPELINE_LISTENER_NAME_ENUM;

  @Column('int', { comment: 'status' })
  status: PIPELINE_BASE_STATUS_ENUM;

  @Transform(dateFormat())
  @Column('text', { comment: '创建时间' })
  createTime: Date;

  @Transform(dateFormat())
  @Column('text', { comment: '更新时间' })
  updateTime: Date;

  // 唯一key
  @Column('varchar', { length: 128, comment: '唯一key', nullable: true })
  unitKey: string;

  @Column({ comment: '额外信息', type: 'simple-json', nullable: true })
  extra: Record<string, any>;
}
