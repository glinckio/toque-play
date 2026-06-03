import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../redis/redis.service';
export declare class MaintenanceMiddleware implements NestMiddleware {
    private redis;
    constructor(redis: RedisService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
