import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch()
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log('====exception', exception);
    // const user = request.get('headers');

    // 不是api开头，render html
    // if (!request.path.startsWith('/api')) {
    //   response.send(``);
    // } else {
    //   response.sendStatus(404);
    // }
    response.status(500).send(`${exception.message}`);
  }
}
