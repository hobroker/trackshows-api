import { Command, CommandRunner } from 'nest-commander';
import { SyncEpisodesService } from '../../sync';
import { CliLogger, Option } from '../util';

interface Options {
  minutes: number;
}

@Command({
  name: 'sync:episodes',
  description: 'Sync data',
})
export class SyncEpisodesCommand implements CommandRunner {
  private readonly logger = new CliLogger(this.constructor.name, {
    action: 'syncing',
  });

  constructor(private readonly syncEpisodesService: SyncEpisodesService) {}

  async run(_, { minutes }: Options) {
    const olderThan = new Date(new Date().getTime() - minutes * 60 * 1000);

    await this.logger.wrap(
      () =>
        this.syncEpisodesService.syncEpisodes({
          seasons: {
            some: {
              updatedAt: {
                lt: olderThan,
              },
            },
          },
        }),
      'episodes',
    );
  }

  @Option({
    flags: '-m, --minutes [minutes]',
    description: "Update shows whose seasons weren't in [minutes]",
    defaultValue: 60 * 12, // 12 hours
  })
  parseMinutesOption(value: string): Options['minutes'] {
    return Number(value);
  }
}
