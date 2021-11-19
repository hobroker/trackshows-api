import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'test',
  description: 'Test',
})
export class TestCommand implements CommandRunner {
  async run() {
    console.log('test');
  }
}
