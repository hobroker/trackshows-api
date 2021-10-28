import {
  Inject,
  Injectable,
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
  constructor(
    @Inject(prismaConfig.KEY)
    private config: ConfigType<typeof prismaConfig>,
  ) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    if (this.config.debug) {
      this.$on<any>('query', (event: Prisma.QueryEvent) => {
        console.log('Query: ' + event.query);
        console.log('Duration: ' + event.duration + 'ms\n');
      });
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
