import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from '../../prisma';
import { cliConfig } from '../cli.config';

@Injectable()
export class CliSetupService implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {}

  @Inject(cliConfig.KEY)
  private config: ConfigType<typeof cliConfig>;

  onModuleInit(): any {
    const { debug } = this.config;

    this.prismaService.setDebug(debug);
  }
}
