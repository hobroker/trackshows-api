import { Logger } from '@nestjs/common';
import { handleError } from '../../logger/util';
import { timer } from '../../../util/timer';

export const createActionWrapper =
  (logger: Logger) => (promiseFn: () => Promise<any>) => {
    const time = timer();

    return promiseFn()
      .then((data) => {
        logger.log(`Done`, { ms: time() });

        return data;
      })
      .catch(handleError(logger));
  };
