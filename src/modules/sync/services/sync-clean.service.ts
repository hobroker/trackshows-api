import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class SyncCleanService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async deleteAll() {
    await Promise.all([
      this.prismaService.show.deleteMany(),
      this.prismaService.genre.deleteMany(),
      this.prismaService.gender.deleteMany(),
      this.prismaService.keyword.deleteMany(),
      this.prismaService.productionCompany.deleteMany(),
      this.prismaService.status.deleteMany(),
    ]);
  }
}
