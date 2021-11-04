import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class KeywordService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list() {
    return this.prismaService.keyword.findMany({
      orderBy: [{ name: 'asc' }],
    });
  }
}
