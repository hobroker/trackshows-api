import { Logger } from '@nestjs/common';
import { handleError } from '../../logger/util';
import { timer } from '../../../util/timer';

export class CliLogger {
  private readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  wrap(promiseFn: () => Promise<any>) {
    const time = timer();

    return promiseFn()
      .then((data) => {
        this.logger.log(`Done`, { ms: time() });

        return data;
      })
      .catch(handleError(this.logger));
  }
}
