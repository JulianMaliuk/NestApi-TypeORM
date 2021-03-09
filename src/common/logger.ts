import { LoggerService, Logger } from '@nestjs/common';
import { id as rTracerId } from 'cls-rtracer';

export class MyLogger implements LoggerService {
  constructor(private types: Array<string>) {}
  log(message: string) {
    if (this.types.includes('log')) Logger.log(message + ` id: ${rTracerId()}`);
  }
  error(message: string, trace: string) {
    if (this.types.includes('error'))
      Logger.error(message + ` id: ${rTracerId()}`, trace);
  }
  warn(message: string) {
    if (this.types.includes('warn'))
      Logger.warn(message + ` id: ${rTracerId()}`);
  }
  debug(message: string) {
    if (this.types.includes('debug'))
      Logger.debug(message + ` id: ${rTracerId()}`);
  }
  verbose(message: string) {
    if (this.types.includes('verbose'))
      Logger.verbose(message + ` id: ${rTracerId()}`);
  }
}
