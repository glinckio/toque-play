import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import StripeInit, { Stripe } from 'stripe';

const StripeCtor = (StripeInit as any).default || StripeInit;

// Stripe webhook tolerance window (seconds). Default 5 min guards against replay attacks.
const WEBHOOK_TOLERANCE_SECONDS = 300;

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(private configService: ConfigService) {
    this.stripe = new StripeCtor(configService.get<string>('STRIPE_SECRET_KEY')!);
    this.webhookSecret = configService.get<string>('STRIPE_WEBHOOK_SECRET')!;
  }

  async createCheckoutSession(params: {
    registrationId: string;
    amount: number;
    tournamentName: string;
    categoryName: string;
    teamName: string;
  }) {
    return this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            unit_amount: Math.round(params.amount * 100),
            product_data: {
              name: `${params.tournamentName} - ${params.categoryName}`,
              description: `Inscricao do time ${params.teamName}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId: params.registrationId,
      },
      success_url: 'toqueplay://payment/success',
      cancel_url: 'toqueplay://payment/cancel',
    });
  }

  constructWebhookEvent(payload: Buffer, signature: string) {
    // tolerance: rejects events older than 5 min (replay protection)
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
      WEBHOOK_TOLERANCE_SECONDS,
    );
  }

  /**
   * Returns true if the event id was already seen (idempotency guard).
   * Uses Redis SETNX with 24h TTL.
   */
  async isEventProcessed(eventId: string, redisSetNxTtl: (key: string, value: string, ttlSec: number) => Promise<boolean>): Promise<boolean> {
    return redisSetNxTtl(`stripe:event:${eventId}`, '1', 24 * 60 * 60);
  }

  /**
   * Best-effort cancel of a Stripe PaymentIntent or Checkout Session.
   * Idempotent — no-op if already canceled/completed.
   */
  async cancelPaymentIntent(paymentId: string): Promise<void> {
    // Stripe checkout session ids start with "cs_"; PaymentIntents with "pi_".
    if (paymentId.startsWith('cs_')) {
      try {
        await this.stripe.checkout.sessions.expire(paymentId);
      } catch (err: any) {
        if (err?.statusCode !== 404 && err?.code !== 'resource_missing') throw err;
      }
      return;
    }
    if (paymentId.startsWith('pi_')) {
      try {
        await this.stripe.paymentIntents.cancel(paymentId);
      } catch (err: any) {
        // ignore if already canceled/completed
        if (
          err?.code !== 'payment_intents_not_cancellable' &&
          err?.statusCode !== 400
        ) {
          throw err;
        }
      }
    }
  }
}
