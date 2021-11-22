import { Command, CommandRunner } from 'nest-commander';
import { SyncGenreService, SyncPersonService } from '../../sync';
import { gendersSeed } from '../data/seed';
import { WithDuration } from '../util';

@Command({
  name: 'seed',
  description: 'Seed the DB',
})
export class SeedCommand implements CommandRunner {
  constructor(
    private readonly syncPersonService: SyncPersonService,
    private readonly syncGenreService: SyncGenreService,
  ) {}

  @WithDuration()
  async run() {
    await this.syncPersonService.insertGenders(gendersSeed);
    await this.syncGenreService.syncAllGenres();
  }
}
