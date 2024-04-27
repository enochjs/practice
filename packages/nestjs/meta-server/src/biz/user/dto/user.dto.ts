import { USER_ROLE_ENUM, USER_STATUS_ENUM } from '@/constants/user';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

export class UserDto {
  @ApiProperty({
    type: 'number',
    description: '用户id',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: '邮箱',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: '用户名称',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: '联系方式',
  })
  mobile: string;

  @ApiProperty({
    type: Number,
    description: '角色',
  })
  role: USER_ROLE_ENUM;

  @ApiProperty({
    type: Number,
    description: '状态',
  })
  status: USER_STATUS_ENUM;

  @ApiProperty({
    type: String,
    description: '创建时间',
  })
  createTime: Date;

  @ApiProperty({
    type: String,
    description: '更新时间',
  })
  updateTime: Date;
}
