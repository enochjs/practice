import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { PipelineProcessor } from './core/pipeline.processor';
import { PIPELINE_PROCESSOR_ENUM } from './core/constants';
import { CreatePipelineDto } from './dto/pipeline.operate.dto';

@ApiTags('Pipeline')
@Controller('api/pipeline')
export class PipelineController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly pipelineProcessor: PipelineProcessor,
  ) {
    this.logger.setContext(PipelineController.name);
  }

  @Post('create')
  async createPipeline(@Body() data: CreatePipelineDto) {
    this.logger.info('createPipeline, %j', data);
    await this.pipelineProcessor.addQueue(
      PIPELINE_PROCESSOR_ENUM.PROCESS_PIPELINE_CREATE,
      {
        ...data,
        creator: 1,
      },
    );
  }
}
