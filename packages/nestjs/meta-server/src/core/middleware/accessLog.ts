import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { PinoLogger } from 'nestjs-pino';
import requestIp from 'request-ip';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  @Inject()
  private readonly logger: PinoLogger;

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const ip = requestIp.getClientIp(req);
    const id = randomUUID();
    req.headers['x-request-id'] = id;
    this.logger.info(`${req.hostname}_${method}_${url}_${ip} request start`);
    const start = Date.now();
    res.on('close', () => {
      const { statusCode } = res;
      this.logger.info(
        `${req.hostname}_${method}_${url}_${ip}_${statusCode} request end - ${
          Date.now() - start
        }ms`,
      );
    });
    next();
  }
}
