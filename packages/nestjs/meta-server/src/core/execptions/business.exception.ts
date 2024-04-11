import { HttpException, HttpStatus } from '@nestjs/common';

type BusinessExceptionType = {
  message: string;
  errorDetail?: string;
  [key: string]: any;
};

export class BusinessException extends HttpException {
  constructor(options: string | BusinessExceptionType) {
    const _options =
      typeof options === 'string'
        ? {
            message: options,
          }
        : options;
    super(
      {
        name: 'BussinessError',
        ..._options,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
