import { Command, CommandRunner } from 'nest-commander';
import { SyncCleanService } from '../../sync';
import { WithDuration } from '../util';

@Command({
  name: 'clean',
  description: 'Clean database',
})
export class CleanCommand implements CommandRunner {
  constructor(private readonly syncCleanService: SyncCleanService) {}

  @WithDuration()
  async run() {
    await this.syncCleanService.deleteAll();
  }
}
