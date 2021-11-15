import { Command, Console } from 'nestjs-console';
import { Inject, Logger } from '@nestjs/common';
import {
  SyncCleanService,
  SyncPersonService,
  SyncShowService,
} from '../../sync';
import { gendersSeed, showIdsSeed } from '../data/seed';

@Console()
export class ConsoleService {
  @Inject(SyncPersonService)
  private readonly syncPersonService: SyncPersonService;

  @Inject(SyncShowService)
  private readonly syncShowService: SyncShowService;

  @Inject(SyncCleanService)
  private readonly syncCleanService: SyncCleanService;

  private readonly logger = new Logger(ConsoleService.name);

  @Command({
    command: 'seed [option]',
    description: 'Seed the DB',
  })
  async seed(option: string) {
    if (option === 'clean') {
      await this.clean();
    }

    await this.wrap(
      this.syncPersonService.insertGenders(gendersSeed),
      'genders',
    );

    await this.wrap(this.addShows(showIdsSeed), 'shows');
  }

  @Command({
    command: 'clean',
    description: 'Remove seed data from the DB',
  })
  async clean() {
    await this.syncCleanService.deleteAll();
  }

  private async addShows(showIds: number[]) {
    await this.syncShowService.syncMany(showIds);
    // const promiseFns = showIds.map(
    //   (showId) => () =>
    //     this.syncShowService.syncOne(showId).catch((err) => {
    //       this.logger.error(`\tError on showId=${showId}`);
    //       this.logger.error(err);
    //     }),
    // );
    //
    // await serial(promiseFns, 10);
  }

  private wrap(promise: Promise<any>, subject = '') {
    this.logger.log(`Syncing ${subject}`);

    return promise
      .then(() => {
        this.logger.log(`Done syncing ${subject}`);
      })
      .catch((err) => {
        this.logger.error(`Error syncing ${subject}`);
        this.logger.error(err);
      });
  }
}
