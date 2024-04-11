import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CreatePipelineTplDto, ModifyPipelineTplDto } from './dto/opreate.dto';
import { PinoLogger } from 'nestjs-pino';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PipelineTplDto } from './dto/pipeline.tpl.dto';
import { PipelineTplService } from './pipeline.tpl.service';

@ApiTags('pipelineTpl')
@Controller('api/pipeline/tpl')
export class PipelineTplController {
  constructor(
    private pipelineTplService: PipelineTplService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(PipelineTplController.name);
  }

  @Post('create')
  @ApiOkResponse({
    type: PipelineTplDto,
  })
  async create(@Body() data: CreatePipelineTplDto) {
    return this.pipelineTplService.create({
      ...data,
      creator: 1,
      updater: 1,
    });
  }

  @Put('update')
  @ApiOkResponse({
    type: PipelineTplDto,
  })
  async update(@Body() data: ModifyPipelineTplDto) {
    return this.pipelineTplService.update({
      ...data,
      creator: 1,
      updater: 1,
    });
  }

  @Get('detail/:id')
  async detail(@Query('id') id: number) {
    const result = await this.pipelineTplService.findById(id);
    this.logger.info('detail', result);
    return result;
  }
}
