import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

const RETENTION_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24h

/**
 * LGPD-aligned retention: prune stale records per documented policy.
 * Notification>180d, EmailVerification expired, DeviceToken>90d,
 * RefreshToken expired. (Chat/MatchEvent archival to Glacier = future task.)
 */
@Injectable()
export class PrivacyRetentionCron implements OnModuleInit {
  private readonly logger = new Logger(PrivacyRetentionCron.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    // First run after 10min of boot, then daily.
    this.timer = setInterval(() => {
      this.run()
        .catch((err) => this.logger.warn(`retention failed: ${(err as Error).message}`));
    }, RETENTION_INTERVAL_MS);
    this.timer.unref?.();
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async run(): Promise<void> {
    const now = new Date();

    const notifCutoff = new Date(now);
    notifCutoff.setDate(notifCutoff.getDate() - 180);
    const notifRes = await this.prisma.notification.deleteMany({
      where: { createdAt: { lt: notifCutoff } },
    });

    const verifRes = await this.prisma.emailVerification.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    const tokenCutoff = new Date(now);
    tokenCutoff.setDate(tokenCutoff.getDate() - 90);
    const tokenRes = await this.prisma.deviceToken.deleteMany({
      where: { createdAt: { lt: tokenCutoff } },
    });

    const refreshRes = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    this.logger.log(
      `retention sweep: notifications=${notifRes.count} emailVerifications=${verifRes.count} deviceTokens=${tokenRes.count} refreshTokens=${refreshRes.count}`,
    );
  }
}
