import { PIPELINE_BASE_STATUS_ENUM } from '@/biz/pipeline/processor/core/constants';
import { dateFormat } from '@/utils/transform';
import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('pipeline')
@Index('idx_pipeline', ['id'], { unique: true })
export class Pipeline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int', { comment: '应用 id' })
  appId: number;

  @Column('int', { comment: '迭代 id' })
  iterationId: number;

  @Column('int', { comment: 'git project id' })
  repoId: number;

  @Column('int', { comment: '操作人id' })
  creator: number;

  @Transform(dateFormat())
  @Column('text', { comment: '创建时间' })
  createTime: moment.Moment;

  @Transform(dateFormat())
  @Column('text', { comment: '更新时间' })
  updateTime: moment.Moment;

  @Column('int', { comment: 'pipeline 状态' })
  status: PIPELINE_BASE_STATUS_ENUM;

  @Column('int', { comment: '当前阶段', default: -1 })
  stageSeq: number;

  @Column('int', { comment: '执行模版id' })
  tplId: number;

  @Column('varchar', { length: 64, comment: '分支' })
  branch: string;

  @Column('varchar', { length: 512, comment: '发布内容', nullable: true })
  content: string;

  @Column({ comment: '额外信息', type: 'simple-json', nullable: true })
  extra: Record<string, any>;
}
