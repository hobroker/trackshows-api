import { Command, Console } from 'nestjs-console';
import { Inject, Logger } from '@nestjs/common';
import { SyncGenderService, SyncShowService } from '../../sync';
import { serial } from '../../../util/promise';
import { gendersSeed, showIdsSeed } from '../data/seed';

@Console()
export class ConsoleService {
  @Inject(SyncGenderService)
  private readonly syncGenderService: SyncGenderService;

  @Inject(SyncShowService)
  private readonly syncShowService: SyncShowService;

  private readonly logger = new Logger(ConsoleService.name);

  @Command({
    command: 'seed [option]',
    description: 'Seed the DB',
  })
  async seed(option: string) {
    if (option === 'clean') {
      await this.clean();
    }

    await this.wrap(this.syncGenderService.insert(gendersSeed), 'genders');

    await this.wrap(this.addShows(showIdsSeed), 'shows');
  }

  @Command({
    command: 'clean',
    description: 'Remove seed data from the DB',
  })
  async clean() {
    await this.syncGenderService.deleteAll();
    await this.syncShowService.deleteAll();
  }

  private async addShows(showIds: number[]) {
    const promiseFns = showIds.map(
      (showId) => () =>
        this.syncShowService
          .syncOne(showId)
          .then(({ name }) => this.logger.log(`\tAdded ${name}`))
          .catch((err) => {
            this.logger.error(`\tError on showId=${showId}`);
            this.logger.error(err);
          }),
    );

    await serial(promiseFns, 4);
  }

  private wrap(promise: Promise<any>, subject = '') {
    this.logger.log(`Syncing ${subject}`);

    return promise
      .then(() => this.logger.log(`Done syncing ${subject}`))
      .catch((err) => {
        this.logger.error(`Error syncing ${subject}`);
        this.logger.error(err);
      });
  }
}
