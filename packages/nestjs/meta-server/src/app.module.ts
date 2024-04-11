import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@/core/interceptors/validator.pipe';
import { TransformInterceptor } from '@/core/interceptors/transform.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpExceptionFilter } from '@/core/execptions/http.exception.filter';
import { CoreModule } from '@/core/core.module';
import { BizModule } from '@/biz/bizModule';
import { LoggerMiddleware } from '@/core/middleware/accessLog';

@Module({
  imports: [CoreModule, CacheModule.register(), BizModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
