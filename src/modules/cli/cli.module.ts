import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CliSetupService } from './services';
import { cliConfig } from './cli.config';
import * as Commands from './commands';
import { PrismaModule } from '../prisma';

@Module({
  imports: [ConfigModule.forFeature(cliConfig), PrismaModule],
  providers: [...Object.values(Commands), CliSetupService],
})
export class CliModule {}
