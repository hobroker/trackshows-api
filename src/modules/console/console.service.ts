import { Console, Command, createSpinner } from 'nestjs-console';
import { Inject } from '@nestjs/common';
import { SyncGenreService } from '../sync';

@Console()
export class ConsoleService {
  @Inject(SyncGenreService)
  private readonly syncGenreService: SyncGenreService;

  @Command({
    command: 'sync',
    description: 'Fetch default data from TMDB',
  })
  async sync() {
    const spin = createSpinner();
    spin.start(`Working`);

    await this.syncGenreService.syncAll();

    spin.succeed('Done');
  }
}
