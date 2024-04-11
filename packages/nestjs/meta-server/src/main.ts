import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import configuration from 'config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(configuration.KEY);
  const env = config.env.toLowerCase();
  const port = config.port;

  if (env !== 'prod' && env !== 'pre') {
    const config = new DocumentBuilder()
      .setTitle('Page Server Api')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
