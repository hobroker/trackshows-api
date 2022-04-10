import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, RequestMethod } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoggerService } from './modules/logger';
import { AppModule } from './app.module';
import { APP_MODULE_ID } from './app.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });
  const configService = app.get(ConfigService);
  const { port } = configService.get(APP_MODULE_ID);

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3003'],
    credentials: true,
  });
  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const logger = new Logger('bootstrap');

  await app.listen(port, () => {
    logger.log(`🚀 Server ready at: http://localhost:${port}/graphql`);
  });
}

bootstrap();
