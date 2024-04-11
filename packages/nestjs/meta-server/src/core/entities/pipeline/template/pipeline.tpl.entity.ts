import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { PipelineTplStage } from './pipeline.tpl.stage.entity';
import { Expose, Transform } from 'class-transformer';
import { dateFormat } from '@/utils/transform';

// 流水线模版
@Entity('pipeline_tpl')
@Index('idx_pipeline_tpl', ['name'], {
  unique: true,
})
export class PipelineTpl {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 64, comment: '模版名称' })
  name: string;

  @Transform(dateFormat())
  @Column('text', { comment: '创建时间' })
  createTime: moment.Moment;

  @Transform(dateFormat())
  @Column('text', { comment: '更新时间' })
  updateTime: moment.Moment;

  @Expose()
  statusCn() {
    return '正常';
  }

  @Column('int', { comment: '创建人' })
  creator: number;

  @Column('int', { comment: '更新人', nullable: true })
  updater: number;

  @OneToMany(() => PipelineTplStage, (stage) => stage.tpl, {
    cascade: true,
    eager: true,
    createForeignKeyConstraints: false,
  })
  stages: PipelineTplStage[];
}
