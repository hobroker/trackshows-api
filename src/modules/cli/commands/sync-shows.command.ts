import { Command, CommandRunner } from 'nest-commander';
import { SyncShowService } from '../../sync';
import { Option, WithDuration } from '../util';

interface Options {
  force: boolean;
}

@Command({
  name: 'sync:shows',
  description: 'Sync data',
})
export class SyncShowsCommand implements CommandRunner {
  constructor(private readonly syncShowService: SyncShowService) {}

  @WithDuration()
  async run(_, { force }: Options) {
    const where = force ? {} : { statusId: null };

    await this.syncShowService.syncDetails(where);
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
