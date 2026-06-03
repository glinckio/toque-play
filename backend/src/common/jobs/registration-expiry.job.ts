import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma.service';
import { RegistrationStatus } from '@prisma/client';

@Processor('registration-expiry')
export class RegistrationExpiryProcessor {
  constructor(private prisma: PrismaService) {}

  @Process('expire')
  async handleExpiry(job: Job<{ registrationId: string }>) {
    const { registrationId } = job.data;

    const registration = await this.prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) return;

    if (registration.status !== RegistrationStatus.PENDING_PAYMENT) {
      return; // already processed, skip
    }

    await this.prisma.registration.update({
      where: { id: registrationId },
      data: { status: RegistrationStatus.CANCELLED },
    });
  }
}
