import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RegistrationExpiryProcessor } from './registration-expiry.job';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    BullModule.registerQueue({
      name: 'registration-expiry',
    }),
  ],
  providers: [RegistrationExpiryProcessor],
  exports: [BullModule],
})
export class JobsModule {}
