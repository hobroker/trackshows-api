import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class GenreService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list() {
    return this.prismaService.genre.findMany({
      orderBy: [{ name: 'asc' }],
    });
  }
}
