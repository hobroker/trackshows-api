import { BootstrapConsole } from 'nestjs-console';
import { Logger } from '@nestjs/common';
import { ConsoleModule } from '../modules/console';
import { LoggerService } from '../modules/logger/logger.service';

async function bootstrap() {
  const cli = new BootstrapConsole({
    module: ConsoleModule,
    useDecorators: true,
    contextOptions: {
      logger: new LoggerService(),
    },
  });
  const app = await cli.init();
  const logger = new Logger('console');

  try {
    await app.init();
    await cli.boot();
    await app.close();
  } catch (err) {
    logger.error(err);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
