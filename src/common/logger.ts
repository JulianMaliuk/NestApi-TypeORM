import { LoggerService, Logger } from '@nestjs/common';
import { id as rTracerId } from 'cls-rtracer';

export class MyLogger implements LoggerService {
  constructor(private types: Array<string>) {}
  log(message: string, ...args) {
    if (this.types.includes('log'))
      Logger.log(message + ` id: ${rTracerId()}`, ...args);
  }
  error(message: string, trace: string, ...args) {
    if (this.types.includes('error'))
      Logger.error(message + ` id: ${rTracerId()}`, trace, ...args);
  }
  warn(message: string, ...args) {
    if (this.types.includes('warn'))
      Logger.warn(message + ` id: ${rTracerId()}`, ...args);
  }
  debug(message: string, ...args) {
    if (this.types.includes('debug'))
      Logger.debug(message + ` id: ${rTracerId()}`, ...args);
  }
  verbose(message: string, ...args) {
    if (this.types.includes('verbose'))
      Logger.verbose(message + ` id: ${rTracerId()}`, ...args);
  }
}
