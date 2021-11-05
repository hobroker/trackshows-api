import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class ShowService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async listKeywords() {
    return this.prismaService.keyword.findMany({
      orderBy: [{ name: 'asc' }],
    });
  }

  async listShows() {
    return this.prismaService.show.findMany({
      orderBy: [{ name: 'asc' }],
    });
  }
}
