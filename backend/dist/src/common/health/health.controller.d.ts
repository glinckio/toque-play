import { PrismaService } from '../prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class HealthController {
    private prisma;
    private redisService;
    constructor(prisma: PrismaService, redisService: RedisService);
    check(): Promise<{
        status: string;
        database: "up" | "down";
        redis: "up" | "down";
        timestamp: string;
    }>;
}
