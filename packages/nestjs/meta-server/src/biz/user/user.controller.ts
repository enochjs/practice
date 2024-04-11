import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/opreate.dto';
import { PinoLogger } from 'nestjs-pino';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserController.name);
  }

  @Post('create')
  @ApiOkResponse({
    type: UserDto,
  })
  async create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Get('detail/:id')
  async detail(@Query('id') id: number) {
    const result = await this.userService.findByUserId(id);
    this.logger.info('detail', result);
    return result;
  }
}
