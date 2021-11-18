import { Command, CommandRunner } from 'nest-commander';
import { CliLogger } from '../util';
import { SyncCleanService } from '../../sync';

@Command({
  name: 'clean',
  description: 'Clean database',
})
export class CleanCommand implements CommandRunner {
  private readonly logger = new CliLogger(this.constructor.name, {
    action: 'deleting',
  });

  constructor(private readonly syncCleanService: SyncCleanService) {}

  async run() {
    await this.logger.wrap(() => this.syncCleanService.deleteAll(), 'entities');
  }
}
