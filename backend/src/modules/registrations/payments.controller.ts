import { Controller, Post, Body, Req, HttpCode, HttpStatus, RawBodyRequest, Headers, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { RegistrationsService } from './registrations.service';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { StripeService } from '../../common/services/stripe.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly registrationsService: RegistrationsService,
    private readonly stripeService: StripeService,
  ) {}

  @Public()
  @Post('stripe/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook do Stripe' })
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = this.stripeService.constructWebhookEvent(req.rawBody!, signature);
    await this.registrationsService.handleStripeWebhook(event);

    return { received: true };
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de pagamento (stub/teste manual)' })
  async handleWebhook(@Body() dto: PaymentWebhookDto) {
    return this.registrationsService.handlePaymentWebhook(dto);
  }
}
