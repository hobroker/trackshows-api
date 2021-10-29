import { LoggerService as LoggerServiceInterface } from '@nestjs/common';
import { logger } from './logger.util';

export class LoggerService implements LoggerServiceInterface {
  log(message: any, ...rest: any[]) {
    logger.log(rest.pop(), message, ...rest);
  }

  error(message: any, ...rest: any[]) {
    logger.error(rest.pop(), message, ...rest);
  }

  warn(message: any, ...rest: any[]) {
    logger.warn(rest.pop(), message, ...rest);
  }

  debug?(message: any, ...rest: any[]) {
    logger.debug(rest.pop(), message, ...rest);
  }

  verbose?(message: any, ...rest: any[]) {
    logger.verbose(rest.pop(), message, ...rest);
  }
}
