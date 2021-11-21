import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { SyncCleanService } from '../../sync';
import { createActionWrapper } from '../util';

@Command({
  name: 'clean',
  description: 'Clean database',
})
export class CleanCommand implements CommandRunner {
  private readonly logger = new Logger(this.constructor.name);
  private wrapper = createActionWrapper(this.logger);

  constructor(private readonly syncCleanService: SyncCleanService) {}

  async run() {
    await this.wrapper(() => this.syncCleanService.deleteAll());
  }
}
