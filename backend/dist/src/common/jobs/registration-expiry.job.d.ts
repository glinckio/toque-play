import { Job } from 'bull';
import { PrismaService } from '../prisma.service';
export declare class RegistrationExpiryProcessor {
    private prisma;
    constructor(prisma: PrismaService);
    handleExpiry(job: Job<{
        registrationId: string;
    }>): Promise<void>;
}
