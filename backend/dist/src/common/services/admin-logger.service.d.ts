import { PrismaService } from '../prisma.service';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR';
export declare class AdminLoggerService {
    private prisma;
    constructor(prisma: PrismaService);
    log(level: LogLevel, message: string, source?: string, stack?: string, metadata?: any): Promise<void>;
    info(message: string, source?: string, metadata?: any): Promise<void>;
    warn(message: string, source?: string, metadata?: any): Promise<void>;
    error(message: string, source?: string, stack?: string, metadata?: any): Promise<void>;
    cleanup(retentionDays?: number): Promise<void>;
}
