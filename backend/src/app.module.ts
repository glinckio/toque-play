import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma.module';
import { StripeModule } from './common/stripe.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TeamsModule } from './modules/teams/teams.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { BracketsModule } from './modules/brackets/brackets.module';
import { MatchesModule } from './modules/matches/matches.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { FriendliesModule } from './modules/friendlies/friendlies.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationModule } from './common/services/notification.module';
import { RedisModule } from './common/redis/redis.module';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HomeModule } from './modules/home/home.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './common/health/health.module';
import { SentryModule } from './common/sentry/sentry.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    PrismaModule,
    RedisModule,
    StripeModule,
    NotificationModule,
    HealthModule,
    SentryModule,
    StorageModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    TournamentsModule,
    RegistrationsModule,
    BracketsModule,
    MatchesModule,
    RankingModule,
    FriendliesModule,
    ChatModule,
    NotificationsModule,
    HomeModule,
    AdminModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
