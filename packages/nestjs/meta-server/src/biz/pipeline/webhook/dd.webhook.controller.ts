import { Body, Controller, HttpCode, Post, Query, Res } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DdService } from '@/core/dd/dd.service';

@Controller('api/pipeline/dd')
export class DdWebhookController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly ddService: DdService,
  ) {
    this.logger.setContext(DdWebhookController.name);
  }

  @Post('/callback')
  @HttpCode(200)
  async callback(
    @Query() query: { signature: string; timestamp: string; nonce: string },
    @Body() body: { encrypt: string },
    @Res() response,
  ) {
    this.logger.info('收到钉钉回调', query, body);
    response.send('success');
  }
}
