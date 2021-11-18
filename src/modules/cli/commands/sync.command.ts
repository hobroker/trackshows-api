import { Command, CommandRunner } from 'nest-commander';
import { SyncCleanService, SyncTrendingService } from '../../sync';
import { CliLogger, Option } from '../util';

interface SyncCommandOptions {
  clean: boolean;
  start: number;
  end: number;
}

@Command({
  name: 'sync',
  description: 'Sync data',
})
export class SyncCommand implements CommandRunner {
  private readonly logger = new CliLogger(this.constructor.name, {
    action: 'syncing',
  });

  constructor(
    private readonly syncTrendingService: SyncTrendingService,
    private readonly syncCleanService: SyncCleanService,
  ) {}

  async run(_, { start, end, clean }: SyncCommandOptions) {
    if (clean) await this.runClean();

    await this.logger.wrap<{ data: number[] }>(
      () => this.syncTrendingService.syncTrending(start, end),
      'partial trending shows',
    );
  }

  @Option({
    flags: '--clean',
    description: 'If should delete shows from DB',
    defaultValue: false,
  })
  parseCleanOption(): SyncCommandOptions['clean'] {
    return true;
  }

  @Option({
    flags: '--start [start]',
    description: 'Start page inclusive',
    defaultValue: 1,
  })
  parseStartOption(value: string): SyncCommandOptions['start'] {
    return Number(value);
  }

  @Option({
    flags: '--end [end]',
    description: 'End page exclusive',
    required: true,
    defaultValue: 10,
  })
  parseEndOption(value: string): SyncCommandOptions['end'] {
    return Number(value);
  }

  private async runClean() {
    await this.logger.wrap(
      () => this.syncCleanService.deleteShows(),
      'shows',
      'deleting',
    );
  }
}
