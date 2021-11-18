import { Logger } from '@nestjs/common';
import { timer } from '../../../util/timer';

export class ConsoleLogger {
  private logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  wrap(promiseFn: () => Promise<any>, subject = '', action = 'syncing') {
    const time = timer();
    this.logger.log(`Syncing ${subject}`);

    return promiseFn()
      .then(({ count } = {}) => {
        this.logger.log(`Done ${action} ${count} ${subject}`, { ms: time() });
      })
      .catch((err) => {
        this.logger.error(`Error ${action} ${subject}`);
        this.logger.error(err);
      });
  }
}
