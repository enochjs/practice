import {
  USER_ROLE_ENUM,
  USER_ROLE_ENUM_LIST,
  USER_STATUS_ENUM,
} from '@/constants/user';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: '邮箱',
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    description: '用户名称',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: '联系方式',
  })
  @IsString()
  mobile: string;

  @ApiProperty({
    type: Number,
    description: '角色',
  })
  @IsEnum(USER_ROLE_ENUM_LIST.map((item) => item.value))
  role: USER_ROLE_ENUM;

  @ApiProperty({
    type: Number,
    description: '状态',
  })
  @IsEnum([USER_STATUS_ENUM.DISABLE, USER_STATUS_ENUM.ENABLE])
  @IsOptional()
  status: USER_STATUS_ENUM;
}

export class ModifyUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    type: Number,
    description: '站点id',
  })
  @IsInt()
  id: number;
}
