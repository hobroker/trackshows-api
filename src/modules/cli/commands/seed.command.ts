import { Command, CommandRunner } from 'nest-commander';
import { SyncGenreService, SyncPersonService } from '../../sync';
import { gendersSeed } from '../data/seed';

@Command({
  name: 'seed',
  description: 'Seed the DB',
})
export class SeedCommand implements CommandRunner {
  constructor(
    private readonly syncPersonService: SyncPersonService,
    private readonly syncGenreService: SyncGenreService,
  ) {}

  async run() {
    await this.syncPersonService.insertGenders(gendersSeed);
    await this.syncGenreService.syncAllGenres();
  }
}
