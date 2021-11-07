import { Command, Console } from 'nestjs-console';
import { Inject } from '@nestjs/common';
import { SyncShowService } from '../../sync';
import { serial } from '../../../util/serial';

@Console()
export class ConsoleService {
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

    await this.addShows([1396]);
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
