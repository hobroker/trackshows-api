import { Command, Console, createSpinner } from 'nestjs-console';
import { Inject } from '@nestjs/common';
import { SyncGenreService, SyncPersonService } from '../../sync';
import { SyncGenderService } from '../../sync/services/sync-gender.service';
import { gendersSeed } from '../console.constants';

@Console()
export class ConsoleService {
  private spinner;

  @Inject(SyncGenreService)
  private readonly syncGenreService: SyncGenreService;

  @Inject(SyncGenderService)
  private readonly syncGenderService: SyncGenderService;

  @Inject(SyncPersonService)
  private readonly syncPersonService: SyncPersonService;

  @Command({
    command: 'seed',
    description: 'Insert default data from TMDB',
  })
  async seed() {
    this.spinner = createSpinner();
    this.spinner.start(`Working`);

    // genre
    await this.syncGenreService.sync().then(this.log('genres'));

    // person
    await this.syncGenderService.insert(gendersSeed).then(this.log('genders'));

    this.spinner.succeed('Done');
  }

  @Command({
    command: 'test',
    description: 'test',
  })
  async test() {
    console.log(await this.syncPersonService.sync(53828));
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
