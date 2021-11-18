import { Command, CommandRunner } from 'nest-commander';
import { SyncPersonService, SyncShowService } from '../../sync';
import { gendersSeed } from '../data/seed';
import { CliLogger } from '../util';

@Command({
  name: 'seed',
  description: 'Seed the DB',
})
export class SeedCommand implements CommandRunner {
  private readonly logger = new CliLogger(this.constructor.name, {
    action: 'syncing',
  });

  constructor(
    private readonly syncPersonService: SyncPersonService,
    private readonly syncShowService: SyncShowService,
  ) {}

  async run() {
    await this.logger.wrap(
      () => this.syncPersonService.insertGenders(gendersSeed),
      'genders',
    );
    await this.logger.wrap(
      () => this.syncShowService.syncAllGenres(),
      'genres',
    );
  }
}