import { Command, Console } from 'nestjs-console';
import { SyncCleanService } from '../../sync';
import { ConsoleLogger } from '../util';

@Console()
export class ConsoleCleanService {
  private logger = new ConsoleLogger(ConsoleCleanService.name);

  constructor(private readonly syncCleanService: SyncCleanService) {}

  @Command({
    command: 'clean',
    description: 'Remove seed data from the DB',
  })
  async clean() {
    await this.logger.wrap(
      () => this.syncCleanService.deleteAll(),
      'entities',
      'deleting',
    );
  }
}
