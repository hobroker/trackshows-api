import { Inject, Injectable } from '@nestjs/common';
import { compose, map, objOf, prop, sum } from 'rambda';
import { PrismaService } from '../../prisma';

const createCount = compose(objOf('count'), sum, map(prop('count')));

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
    ]).then(createCount);
  }

  async deleteShows() {
    return Promise.all([this.prismaService.show.deleteMany()]).then(
      createCount,
    );
  }
}
