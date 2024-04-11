import { Injectable, Logger } from '@nestjs/common';
import { asyncLocalStorage } from './decorator';

@Injectable()
export class PipelineLogger {
  protected eventName: string;
  protected readonly logger = new Logger(PipelineLogger.name);

  public info(...args: any[]) {
    const [message, ...restArgs] = args;
    const pipelineId = asyncLocalStorage.getStore();
    this.logger.log(`pipelineId=${pipelineId}: ${message}`, ...restArgs);
  }

  public log(...args: any[]) {
    const pipelineId = asyncLocalStorage.getStore();
    this.logger.log(`pipelineId=${pipelineId}`, args);
  }

  public error(...args: any[]) {
    const pipelineId = asyncLocalStorage.getStore();
    this.logger.error(`pipelineId=${pipelineId}, %j`, ...args);
  }
}
