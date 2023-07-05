import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  const configService = app.get(ConfigService);

  const HOST = configService.get<string>('app.Server.Host');
  const PORT = configService.get<number>('app.Server.Port');
  await app.listen(PORT, () => {
    console.log(`Server is started on ${HOST}: ${PORT}`);
  });
}
bootstrap();
