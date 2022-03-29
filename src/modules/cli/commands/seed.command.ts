import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { WithDuration } from '../util';

@Command({
  name: 'seed',
  description: 'Seed the DB',
})
export class SeedCommand implements CommandRunner {
  private readonly logger = new Logger(this.constructor.name);

  @WithDuration()
  async run() {
    this.logger.error('Nothing to do');
  }
}
