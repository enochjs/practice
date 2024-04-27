import { Body, Controller, Post } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Controller('api/pipeline/git')
export class GitWebhookController {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(GitWebhookController.name);
  }

  @Post('/callback')
  async callback(@Body() body: { encrypt: string }) {
    console.log('=========', body);
    // const msg = this.ddService.decrypt(body.encrypt);
  }
}
