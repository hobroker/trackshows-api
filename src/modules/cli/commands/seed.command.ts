import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { SyncGenreService, SyncPersonService } from '../../sync';
import { gendersSeed } from '../data/seed';
import { createActionWrapper } from '../util';

@Command({
  name: 'seed',
  description: 'Seed the DB',
})
export class SeedCommand implements CommandRunner {
  private readonly logger = new Logger(this.constructor.name);
  private wrapper = createActionWrapper(this.logger);

  constructor(
    private readonly syncPersonService: SyncPersonService,
    private readonly syncGenreService: SyncGenreService,
  ) {}

  async run() {
    await this.wrapper(() => this.syncPersonService.insertGenders(gendersSeed));
    await this.wrapper(() => this.syncGenreService.syncAllGenres());
  }
}
