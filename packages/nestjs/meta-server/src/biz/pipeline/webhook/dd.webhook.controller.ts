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
    const msg = this.ddService.decrypt(body.encrypt);
    switch (msg.EventType) {
      case 'check_url':
        const check = this.ddService.getEncryptedMap({
          timestamp: query.timestamp,
          nonce: query.nonce,
          text: 'success',
        });
        response.status(200).send(check);
        return;
      case 'bpms_task_change':
        console.log('====come in');
      default:
        break;
    }
  }
}
