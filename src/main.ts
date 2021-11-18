import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { LoggerService } from './modules/logger';
import { AppModule } from './app.module';
import { APP_MODULE_ID } from './app.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });
  const logger = new Logger('bootstrap');
  const configService = app.get(ConfigService);
  const { port } = configService.get(APP_MODULE_ID);

  await app.listen(port, () => {
    logger.log(`🚀 Server ready at: http://localhost:${port}/graphql`);
  });
}

bootstrap();
