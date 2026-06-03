import { Injectable, NestMiddleware } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import Queue from 'bull';

@Injectable()
export class BullBoardMiddleware implements NestMiddleware {
  private readonly router: ReturnType<ExpressAdapter['getRouter']>;

  constructor() {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

    const registrationExpiryQueue = new Queue('registration-expiry', {
      redis: { host: redisHost, port: redisPort },
    });

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/api/admin/queues');

    createBullBoard({
      queues: [new BullAdapter(registrationExpiryQueue)],
      serverAdapter,
    });

    this.router = serverAdapter.getRouter();
  }

  use(req: any, res: any, next: () => void) {
    return this.router(req, res, next);
  }
}
