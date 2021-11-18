import { Console } from 'nestjs-console';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from '../../prisma';
import { consoleConfig } from '../console.config';

@Console()
export class ConsoleSetupService implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {}

  @Inject(consoleConfig.KEY)
  private config: ConfigType<typeof consoleConfig>;

  onModuleInit(): any {
    const { debug } = this.config;

    this.prismaService.setDebug(debug);
  }
}
