import { Inject, Injectable, Logger } from '@nestjs/common';
import { compose, map, objOf, prop, sum } from 'rambda';
import { PrismaService } from '../../prisma';

const createCount = compose(objOf('count'), sum, map(prop('count')));

@Injectable()
export class SyncCleanService {
  private readonly logger = new Logger(this.constructor.name);

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async deleteAll() {
    this.logger.log('Deleting everything...');

    return Promise.all([
      this.prismaService.show.deleteMany(),
      this.prismaService.genre.deleteMany(),
      this.prismaService.gender.deleteMany(),
      this.prismaService.keyword.deleteMany(),
      this.prismaService.productionCompany.deleteMany(),
      this.prismaService.status.deleteMany(),
    ])
      .then(createCount)
      .then(({ count }) => this.logger.log(`Deleted ${count} entities`));
  }

  async deleteShows() {
    this.logger.log('Deleting shows...');

    return Promise.all([this.prismaService.show.deleteMany()])
      .then(createCount)
      .then(({ count }) => this.logger.log(`Deleted ${count} entities`));
  }
}
