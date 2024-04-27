import { USER_ROLE_ENUM, USER_STATUS_ENUM } from '@/constants/user';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('user')
@Index('index_mobile', ['mobile'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: '32', comment: '邮箱' })
  email: string;

  @Column('varchar', { length: '32', comment: '人员名称' })
  name: string;

  @Column('varchar', { length: '11', comment: '手机号' })
  mobile: string;

  @Column('tinyint', { comment: '角色' })
  role: USER_ROLE_ENUM;

  @Column('tinyint', { comment: '状态', default: USER_STATUS_ENUM.ENABLE })
  status: USER_STATUS_ENUM;

  @Column('text', { comment: '创建时间' })
  createTime: Date;

  @Column('text', { comment: '更新时间' })
  updateTime: Date;
}
