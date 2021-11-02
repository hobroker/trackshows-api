import { Console } from 'nestjs-console';
import { Inject, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Console()
export class ConsoleSetupService implements OnModuleInit {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  onModuleInit(): any {
    this.prismaService.disableDebug();
  }
}
