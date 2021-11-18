import { Inject, Injectable } from '@nestjs/common';
import { compose, map, objOf, prop, sum } from 'rambda';
import { PrismaService } from '../../prisma';

@Injectable()
export class SyncCleanService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async deleteAll() {
    return Promise.all([
      this.prismaService.show.deleteMany(),
      this.prismaService.genre.deleteMany(),
      this.prismaService.gender.deleteMany(),
      this.prismaService.keyword.deleteMany(),
      this.prismaService.productionCompany.deleteMany(),
      this.prismaService.status.deleteMany(),
    ]).then(compose(objOf('count'), sum, map(prop('count'))));
  }
}
