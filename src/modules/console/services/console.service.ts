import { Command, Console } from 'nestjs-console';
import { Inject } from '@nestjs/common';
import { SyncGenderService, SyncShowService } from '../../sync';
import { serial } from '../../../util/promise';
import { gendersSeed, showIdsSeed } from '../data/seed';

@Console()
export class ConsoleService {
  @Inject(SyncGenderService)
  private readonly syncGenderService: SyncGenderService;

  @Inject(SyncShowService)
  private readonly syncShowService: SyncShowService;

  @Command({
    command: 'seed [option]',
    description: 'Seed the DB',
  })
  async seed(option: string) {
    if (option === 'clean') {
      await this.clean();
    }

    await this.syncGenderService.insert(gendersSeed);

    await this.addShows([showIdsSeed[0]]);
  }

  @Command({
    command: 'clean',
    description: 'Remove seed data from the DB',
  })
  async clean() {
    await this.syncShowService.deleteAll();
  }

  private addShows(showIds: number[]) {
    const promiseFns = showIds.map(
      (showId) => () => this.syncShowService.syncOne(showId),
    );

    return serial(promiseFns);
  }
}
