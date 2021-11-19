import { Command, CommandRunner } from 'nest-commander';
import {
  SyncCleanService,
  SyncEpisodesService,
  SyncShowService,
} from '../../sync';
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
    private readonly syncShowService: SyncShowService,
    private readonly syncEpisodesService: SyncEpisodesService,
    private readonly syncCleanService: SyncCleanService,
  ) {}

  async run(_, { start, end, clean }: SyncCommandOptions) {
    if (clean) await this.runClean();

    await this.logger.wrap(
      () => this.syncShowService.syncTrending(start, end),
      'partial trending shows',
    );

    await this.logger.wrap(
      () => this.syncShowService.linkDetails([93405]),
      'show details',
    );

    await this.logger.wrap(
      () => this.syncEpisodesService.syncEpisodes([93405]),
      'episodes',
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
    defaultValue: 2,
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
