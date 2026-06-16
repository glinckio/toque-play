import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditInterceptor } from './audit.interceptor';
import { AuditCron } from './audit.cron';

@Global()
@Module({
  providers: [AuditService, AuditInterceptor, AuditCron],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}
