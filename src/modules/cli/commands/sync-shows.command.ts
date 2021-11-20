import { Command, CommandRunner } from 'nest-commander';
import { SyncShowService } from '../../sync';
import { CliLogger } from '../util';

@Command({
  name: 'sync:shows',
  description: 'Sync data',
})
export class SyncShowsCommand implements CommandRunner {
  private readonly logger = new CliLogger(this.constructor.name, {
    action: 'syncing',
  });

  constructor(private readonly syncShowService: SyncShowService) {}

  async run() {
    await this.logger.wrap(
      () => this.syncShowService.syncDetails({ statusId: null }),
      'show details',
    );
  }
}
