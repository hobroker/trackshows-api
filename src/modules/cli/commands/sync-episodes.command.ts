import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { SyncEpisodesService } from '../../sync';
import { Option, createActionWrapper } from '../util';

interface Options {
  minutes: number;
}

@Command({
  name: 'sync:episodes',
  description: 'Sync data',
})
export class SyncEpisodesCommand implements CommandRunner {
  private readonly logger = new Logger(this.constructor.name);
  private wrapper = createActionWrapper(this.logger);

  constructor(private readonly syncEpisodesService: SyncEpisodesService) {}

  async run(_, { minutes }: Options) {
    const olderThan = new Date(new Date().getTime() - minutes * 60 * 1000);

    await this.wrapper(() =>
      this.syncEpisodesService.syncEpisodes({
        seasons: {
          some: {
            updatedAt: {
              lt: olderThan,
            },
          },
        },
      }),
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
