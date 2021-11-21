import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { SyncShowService } from '../../sync';
import { Option, createActionWrapper } from '../util';

interface Options {
  force: boolean;
}

@Command({
  name: 'sync:shows',
  description: 'Sync data',
})
export class SyncShowsCommand implements CommandRunner {
  private readonly logger = new Logger(this.constructor.name);
  private wrapper = createActionWrapper(this.logger);

  constructor(private readonly syncShowService: SyncShowService) {}

  async run(_, { force }: Options) {
    const where = force ? {} : { statusId: null };

    await this.wrapper(() => this.syncShowService.syncDetails(where));
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
