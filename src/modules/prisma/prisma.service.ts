import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaConfig } from './prisma.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private isDebugEnabled = false;
  private readonly logger = new Logger(PrismaService.name);

  @Inject(prismaConfig.KEY)
  private config: ConfigType<typeof prismaConfig>;

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    this.isDebugEnabled = this.config.debug;
    this.registerEvents();

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private registerEvents() {
    this.$on<any>('query', (event: Prisma.QueryEvent) => {
      if (!this.isDebugEnabled) {
        return;
      }

      this.logger.debug({
        query: event.query,
        params: event.params,
        duration: event.duration,
      });
    });
    this.$on<any>('info', (event: Prisma.LogEvent) => {
      this.logger.log(event.message);
    });
    this.$on<any>('warn', (event: Prisma.LogEvent) => {
      this.logger.warn(event.message);
    });
    this.$on<any>('error', (event: Prisma.LogEvent) => {
      this.logger.error(event.message);
    });
  }

  setDebug(value: boolean) {
    this.isDebugEnabled = value;
  }
}
