import { HttpException, HttpStatus } from '@nestjs/common';

type ServiceExceptionType = {
  message: string;
  errorDetail?: string;
  [key: string]: any;
};

export class ServiceException extends HttpException {
  constructor(options: string | ServiceExceptionType) {
    const _options =
      typeof options === 'string'
        ? {
            message: options,
          }
        : options;
    super(
      {
        name: 'ServiceError',
        ..._options,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
