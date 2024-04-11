import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { PipelineTplStage } from './pipeline.tpl.stage.entity';
import { PIPELINE_LISTENER_NAME_ENUM } from '@/biz/pipeline/processor/core/constants';

@Entity('pipeline_tpl_job')
@Index('idx_pipeline_tpl_job', ['id'], {
  unique: true,
})
export class PipelineTplJob {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 64, comment: 'job 名称' })
  name: string;

  @Column('varchar', { length: 64, comment: 'job key' })
  jobKey: PIPELINE_LISTENER_NAME_ENUM;

  @ManyToOne(() => PipelineTplStage, (stage) => stage.jobs, {
    createForeignKeyConstraints: false,
  })
  stage: PipelineTplStage;

  @Column('int', { comment: 'stageSeq' })
  stageSeq: number;

  @Column({ comment: '额外信息', type: 'simple-json', nullable: true })
  extra: Record<string, any>;
}
