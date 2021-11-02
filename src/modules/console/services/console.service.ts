import { Command, Console, createSpinner } from 'nestjs-console';
import { Inject } from '@nestjs/common';
import { SyncGenreService } from '../../sync';

@Console()
export class ConsoleService {
  private spinner;

  @Inject(SyncGenreService)
  private readonly syncGenreService: SyncGenreService;

  @Command({
    command: 'seed',
    description: 'Insert default data from TMDB',
  })
  async seed() {
    this.spinner = createSpinner();
    this.spinner.start(`Working`);

    await this.syncGenreService.syncAll().then(this.log('genres'));

    this.spinner.succeed('Done');
  }

  private log(type: string) {
    return ({ count }) => {
      if (count) {
        this.spinner.succeed(`Inserted ${count} ${type}`);
      } else {
        this.spinner.warn(`No ${type} were inserted`);
      }
    };
  }
}
