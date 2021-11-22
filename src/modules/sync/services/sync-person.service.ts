import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { handleError } from '../../logger/util';

@Injectable()
export class SyncPersonService {
  private readonly logger = new Logger(this.constructor.name);

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async insertGenders(data) {
    this.logger.log('Adding genders...');

    return this.prismaService.gender
      .createMany({
        data,
        skipDuplicates: true,
      })
      .then(({ count }) => this.logger.log(`Added ${count} genders`))
      .catch(handleError(this.logger));
  }
}
