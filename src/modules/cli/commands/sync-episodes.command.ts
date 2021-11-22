import { Command, CommandRunner } from 'nest-commander';
import { SyncEpisodesService } from '../../sync';
import { Option, WithDuration } from '../util';

interface Options {
  minutes: number;
}

@Command({
  name: 'sync:episodes',
  description: 'Sync data',
})
export class SyncEpisodesCommand implements CommandRunner {
  constructor(private readonly syncEpisodesService: SyncEpisodesService) {}

  @WithDuration()
  async run(_, { minutes }: Options) {
    const olderThan = new Date(new Date().getTime() - minutes * 60 * 1000);

    await this.syncEpisodesService.syncEpisodes({
      seasons: {
        some: {
          updatedAt: {
            lt: olderThan,
          },
        },
      },
    });
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
