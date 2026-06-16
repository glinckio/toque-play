import { Module } from '@nestjs/common';
import { PrivacyController, AdminPrivacyController } from './privacy.controller';
import { PrivacyService } from './privacy.service';
import { PrivacyRetentionCron } from './privacy-retention.cron';

@Module({
  controllers: [PrivacyController, AdminPrivacyController],
  providers: [PrivacyService, PrivacyRetentionCron],
  exports: [PrivacyService],
})
export class PrivacyModule {}
