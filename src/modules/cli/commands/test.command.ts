import { Command, CommandRunner } from 'nest-commander';
import { WithDuration } from '../util';

@Command({
  name: 'test',
  description: 'Test',
})
export class TestCommand implements CommandRunner {
  @WithDuration()
  async run() {
    console.log('test');
  }
}
