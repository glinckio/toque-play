import { Global, Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';

@Global()
@Module({
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
