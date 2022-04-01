import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { WithDuration } from '../util';
import { PrismaService } from '../../prisma';
import { Status } from '../../watchlist/entities';

@Command({
  name: 'seed',
  description: 'Seed the DB',
})
export class SeedCommand implements CommandRunner {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly prismaService: PrismaService) {}

  @WithDuration()
  async run() {
    await this.insertStatuses();
  }

  private async insertStatuses() {
    const data = [
      { id: Status.None, name: 'None' },
      { id: Status.InWatchlist, name: 'InWatchlist' },
      { id: Status.StoppedWatching, name: 'StoppedWatching' },
    ];

    const { count } = await this.prismaService.status.createMany({
      data,
      skipDuplicates: true,
    });

    this.logger.log(`Inserted ${count} statuses`);
  }
}
