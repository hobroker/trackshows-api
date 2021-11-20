import { Command, CommandRunner } from 'nest-commander';
import { SyncShowService } from '../../sync';
import { CliLogger, Option } from '../util';

interface Options {
  force: boolean;
}

@Command({
  name: 'sync:shows',
  description: 'Sync data',
})
export class SyncShowsCommand implements CommandRunner {
  private readonly logger = new CliLogger(this.constructor.name, {
    action: 'syncing',
  });

  constructor(private readonly syncShowService: SyncShowService) {}

  async run(_, { force }: Options) {
    const where = force ? {} : { statusId: null };

    await this.logger.wrap(
      () => this.syncShowService.syncDetails(where),
      'show details',
    );
  }

  @Option({
    flags: '--force',
    description: 'If should force sync all shows',
    defaultValue: false,
  })
  parseCleanOption(): Options['force'] {
    return true;
  }
}
