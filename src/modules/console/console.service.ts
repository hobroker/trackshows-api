import { Console, Command, createSpinner } from 'nestjs-console';
import { Inject } from '@nestjs/common';
import { TmdbGenreService } from '../tmdb';

@Console()
export class ConsoleService {
  @Inject(TmdbGenreService)
  private readonly tmdbGenreService: TmdbGenreService;

  @Command({
    command: 'sync',
    description: 'Fetch default data from TMDB',
  })
  async sync() {
    const spin = createSpinner();
    spin.start(`Working`);

    await this.tmdbGenreService.syncList();

    spin.succeed('Done');
  }
}
