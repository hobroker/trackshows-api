import { LoggerService as LoggerServiceInterface } from '@nestjs/common';
import { log } from './logger.util';

export class LoggerService implements LoggerServiceInterface {
  log(message: any, ...rest: any[]) {
    log('log')(rest.pop(), message, ...rest);
  }

  error(message: any, ...rest: any[]) {
    log('error')(rest.pop(), message, ...rest);
  }

  warn(message: any, ...rest: any[]) {
    log('warn')(rest.pop(), message, ...rest);
  }

  debug?(message: any, ...rest: any[]) {
    log('debug')(rest.pop(), message, ...rest);
  }

  verbose?(message: any, ...rest: any[]) {
    log('verbose')(rest.pop(), message, ...rest);
  }
}
