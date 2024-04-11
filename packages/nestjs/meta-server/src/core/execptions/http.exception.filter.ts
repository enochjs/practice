import { RobotService } from '@/core/robot';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import configuration from 'config/configuration';
import { Request, Response } from 'express';
import { BusinessException } from './business.exception';
import { ServiceException } from './service.exception';

@Catch(HttpException, BusinessException, ServiceException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly robotService: RobotService,
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
  ) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const env = this.configService.env;
    if (
      (env === 'PROD' || env === 'PRE') &&
      (status >= 500 || status === 400)
    ) {
      await this.robotService.send({
        host: request.hostname,
        env: this.configService.env,
        uuid: '123', //request.id as string,
        message: exception.message,
        method: request.method,
        path: request.path,
        param: JSON.stringify(request.query || request.body),
      });
    }

    const exceptionResponse: any = exception.getResponse();

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        'message' in exceptionResponse
          ? exceptionResponse['message']
          : exceptionResponse,
      uuid: 123, // request.id,
    });
  }
}
