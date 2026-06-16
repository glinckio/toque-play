import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AuditService } from './audit.service';

const PURGE_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000; // ~30 dias
const PURGE_OLDER_THAN_DAYS = 730; // 24 meses

@Injectable()
export class AuditCron implements OnModuleInit {
  private readonly logger = new Logger(AuditCron.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly auditService: AuditService) {}

  onModuleInit() {
    // primeiro run após 1h de boot, depois a cada 30d
    this.timer = setInterval(
      () => {
        this.auditService
          .cleanup(PURGE_OLDER_THAN_DAYS)
          .catch((err) => this.logger.warn(`cleanup failed: ${(err as Error).message}`));
      },
      PURGE_INTERVAL_MS,
    );
    this.timer.unref?.();
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
