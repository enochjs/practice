import { Body, Controller, HttpCode, Post, Query, Res } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DdService } from '@/core/dd/dd.service';

@Controller('api/pipeline/git')
export class GitWebhookController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly ddService: DdService,
  ) {
    this.logger.setContext(GitWebhookController.name);
  }

  @Post('/callback')
  async callback(@Body() body: { encrypt: string }) {
    console.log('=========', body);
    // const msg = this.ddService.decrypt(body.encrypt);
  }
}
