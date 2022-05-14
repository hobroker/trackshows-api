import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma';
import { NotificationModule } from '../notification';
import { CliSetupService } from './services';
import { cliConfig } from './cli.config';
import * as Commands from './commands';

@Module({
  imports: [
    ConfigModule.forFeature(cliConfig),
    PrismaModule,
    NotificationModule,
  ],
  providers: [...Object.values(Commands), CliSetupService],
})
export class CliModule {}
