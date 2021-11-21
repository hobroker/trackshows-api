import { Command, CommandRunner } from 'nest-commander';
import { SyncCleanService } from '../../sync';

@Command({
  name: 'clean',
  description: 'Clean database',
})
export class CleanCommand implements CommandRunner {
  constructor(private readonly syncCleanService: SyncCleanService) {}

  async run() {
    await this.syncCleanService.deleteAll();
  }
}
