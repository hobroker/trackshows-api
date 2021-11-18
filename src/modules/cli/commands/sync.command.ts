import { Command, CommandRunner } from 'nest-commander';
import { SyncTrendingService } from '../../sync';
import { CliLogger } from '../util';

@Command({
  name: 'sync',
  description: 'Sync data',
})
export class SyncCommand implements CommandRunner {
  private readonly logger = new CliLogger(this.constructor.name, {
    action: 'syncing',
  });

  constructor(private readonly syncTrendingService: SyncTrendingService) {}

  async run() {
    await this.logger.wrap(
      () => this.syncTrendingService.syncTrending(1, 10),
      'partial trending shows',
    );
  }
}
