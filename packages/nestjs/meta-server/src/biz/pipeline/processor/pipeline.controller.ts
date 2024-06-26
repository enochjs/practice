import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { PipelineProcessor } from './core/pipeline.processor';
import { PIPELINE_PROCESSOR_ENUM } from './core/constants';
import { CreatePipelineDto } from './dto/pipeline.operate.dto';
import { AuthGuard } from '@/core/guards/auth';
import { UserInfo } from '@/core/decorators/user.decorator';
import { GitService } from '@/core/git/git.service';

@ApiTags('Pipeline')
@UseGuards(AuthGuard)
@Controller('api/pipeline')
export class PipelineController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly pipelineProcessor: PipelineProcessor,
    private readonly gitService: GitService,
  ) {
    this.logger.setContext(PipelineController.name);
  }

  @Post('create')
  async createPipeline(
    @Body() data: CreatePipelineDto,
    @UserInfo() user: UserInfo,
  ) {
    this.logger.info('createPipeline, %j', data);
    await this.pipelineProcessor.addQueue(
      PIPELINE_PROCESSOR_ENUM.PROCESS_PIPELINE_CREATE,
      {
        ...data,
        creator: user.id,
      },
    );
  }

  @Get('test')
  async test() {
    this.logger.info('test');

    const result = await this.gitService.acceptMergeRequest({
      projectId: 1,
      iid: 8,
    });
    return result;
  }
}
