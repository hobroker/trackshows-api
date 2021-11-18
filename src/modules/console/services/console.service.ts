import { Command, Console } from 'nestjs-console';
import { Logger } from '@nestjs/common';
import {
  SyncCleanService,
  SyncPersonService,
  SyncShowService,
  SyncTrendingService,
} from '../../sync';
import { gendersSeed } from '../data/seed';
import { timer } from '../../../util/timer';

@Console()
export class ConsoleService {
  private readonly logger = new Logger(ConsoleService.name);

  constructor(
    private readonly syncPersonService: SyncPersonService,
    private readonly syncShowService: SyncShowService,
    private readonly syncTrendingService: SyncTrendingService,
    private readonly syncCleanService: SyncCleanService,
  ) {}

  @Command({
    command: 'seed [option]',
    description: 'Seed the DB',
  })
  async seed(option: string) {
    if (option === 'clean') {
      await this.clean();
    }

    await this.wrap(
      () => this.syncPersonService.insertGenders(gendersSeed),
      'genders',
    );
    await this.wrap(() => this.syncShowService.syncAllGenres(), 'genres');

    await this.wrap(
      () => this.syncTrendingService.syncTrending(1, 10),
      'partial trending shows',
    );
  }

  @Command({
    command: 'clean',
    description: 'Remove seed data from the DB',
  })
  async clean() {
    await this.wrap(
      () => this.syncCleanService.deleteAll(),
      'entities',
      'deleting',
    );
  }

  private wrap(
    promiseFn: () => Promise<any>,
    subject = '',
    action = 'syncing',
  ) {
    const ms = timer();
    this.logger.log(`Syncing ${subject}`);

    return promiseFn()
      .then(({ count } = {}) => {
        this.logger.log(`Done ${action} ${count} ${subject}`, { ms: ms() });
      })
      .catch((err) => {
        this.logger.error(`Error ${action} ${subject}`);
        this.logger.error(err);
      });
  }
}
