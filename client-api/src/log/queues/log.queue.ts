import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class LogQueue {
  constructor(@InjectQueue('logs') private readonly logQueue: Queue) {}

  async addLog(logData: Record<string, any>) {
    await this.logQueue.add('log', logData, {
      attempts: 2,
      backoff: 5000,
    });
  }
}
