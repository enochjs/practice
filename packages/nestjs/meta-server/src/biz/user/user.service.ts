import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/core/entities/user.entity';
import { CreateUserDto } from './dto/opreate.dto';
import moment from 'moment';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  create(createDto: CreateUserDto) {
    return this.userRepository.save({
      email: createDto.email,
      name: createDto.name,
      mobile: createDto.mobile,
      status: createDto.status,
      createTime: new Date(),
      updateTime: new Date(),
      role: createDto.role,
    });
  }

  async findByUserId(id: number) {
    const result = await this.userRepository.findOne({
      where: { id },
    });
    this.logger.info('findByUserId', result);
    return result;
  }
}
