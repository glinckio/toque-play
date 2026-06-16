import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StripeService } from '../services/stripe.service';
import { RegistrationStatus } from '@prisma/client';

@Processor('registration-expiry')
export class RegistrationExpiryProcessor {
  private readonly logger = new Logger(RegistrationExpiryProcessor.name);

  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

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

    // Cancel any open Stripe PaymentIntent / Checkout Session to prevent late payment.
    if (registration.paymentId) {
      try {
        await this.stripeService.cancelPaymentIntent(registration.paymentId);
      } catch (err) {
        // non-fatal: log and continue — expired registration still transitions to CANCELLED.
        this.logger.warn(
          `failed to cancel paymentIntent ${registration.paymentId}: ${(err as Error).message}`,
        );
      }
    }

    await this.prisma.registration.update({
      where: { id: registrationId },
      data: { status: RegistrationStatus.CANCELLED },
    });
  }
}
