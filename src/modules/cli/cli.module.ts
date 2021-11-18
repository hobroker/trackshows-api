import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SyncModule } from '../sync';
import { CliSetupService } from './services';
import { PrismaModule } from '../prisma';
import { cliConfig } from './cli.config';
import * as Commands from './commands';

@Module({
  imports: [ConfigModule.forFeature(cliConfig), PrismaModule, SyncModule],
  providers: [...Object.values(Commands), CliSetupService],
})
export class CliModule {}
