import { Command, Console } from 'nestjs-console';
import {
  SyncPersonService,
  SyncShowService,
  SyncTrendingService,
} from '../../sync';
import { gendersSeed } from '../data/seed';
import { ConsoleLogger } from '../util';

@Console()
export class ConsoleSeedService {
  private logger = new ConsoleLogger(this.constructor.name, {
    action: 'syncing',
  });

  constructor(
    private readonly syncPersonService: SyncPersonService,
    private readonly syncShowService: SyncShowService,
    private readonly syncTrendingService: SyncTrendingService,
  ) {}

  @Command({
    command: 'seed',
    description: 'Seed the DB',
  })
  async seed() {
    await this.logger.wrap(
      () => this.syncPersonService.insertGenders(gendersSeed),
      'genders',
    );
    await this.logger.wrap(
      () => this.syncShowService.syncAllGenres(),
      'genres',
    );
  }

  @Command({
    command: 'seed-trending',
    description: 'Seed trending shows',
  })
  async seedTrending() {
    await this.logger.wrap(
      () => this.syncTrendingService.syncTrending(1, 10),
      'partial trending shows',
    );
  }
}
