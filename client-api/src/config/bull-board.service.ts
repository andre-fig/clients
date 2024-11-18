import { Injectable, OnModuleInit } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class BullBoardService implements OnModuleInit {
  private logQueue: Queue;

  constructor() {
    this.logQueue = new Queue('logs', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
      },
    });
  }

  async setupBullBoard(app: INestApplication) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [new BullMQAdapter(this.logQueue)],
      serverAdapter,
    });

    const expressInstance = app.getHttpAdapter().getInstance();
    expressInstance.use('/admin/queues', serverAdapter.getRouter());
  }

  async onModuleInit() {}
}
