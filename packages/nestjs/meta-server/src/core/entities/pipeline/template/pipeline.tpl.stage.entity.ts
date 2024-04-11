import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PipelineTpl } from './pipeline.tpl.entity';
import { PipelineTplJob } from './pipeline.tpl.job.entity';

@Entity('pipeline_tpl_stage')
@Index('idx_pipeline_tpl_stage', ['id'], {
  unique: true,
})
export class PipelineTplStage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => PipelineTpl, (tpl) => tpl.stages, {
    createForeignKeyConstraints: false,
  })
  tpl: number;

  @Column('varchar', { length: 64, comment: 'stage 名称' })
  name: string;

  @Column('int', { comment: '当前stage在template中的序列号' })
  seq: number;

  @OneToMany(() => PipelineTplJob, (job) => job.stage, {
    cascade: true,
    eager: true,
    createForeignKeyConstraints: false,
  })
  jobs: PipelineTplJob[];
}
