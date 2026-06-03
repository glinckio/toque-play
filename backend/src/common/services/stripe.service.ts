import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import StripeInit from 'stripe';

const Stripe = (StripeInit as any).default || StripeInit;

@Injectable()
export class StripeService {
  private stripe: any;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY')!);
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
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!,
    );
  }
}
