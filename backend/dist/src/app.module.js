"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./common/prisma.module");
const stripe_module_1 = require("./common/stripe.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const teams_module_1 = require("./modules/teams/teams.module");
const tournaments_module_1 = require("./modules/tournaments/tournaments.module");
const registrations_module_1 = require("./modules/registrations/registrations.module");
const brackets_module_1 = require("./modules/brackets/brackets.module");
const matches_module_1 = require("./modules/matches/matches.module");
const ranking_module_1 = require("./modules/ranking/ranking.module");
const friendlies_module_1 = require("./modules/friendlies/friendlies.module");
const chat_module_1 = require("./modules/chat/chat.module");
const notification_module_1 = require("./common/services/notification.module");
const redis_module_1 = require("./common/redis/redis.module");
const roles_guard_1 = require("./common/guards/roles.guard");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const home_module_1 = require("./modules/home/home.module");
const admin_module_1 = require("./modules/admin/admin.module");
const health_module_1 = require("./common/health/health.module");
const sentry_module_1 = require("./common/sentry/sentry.module");
const storage_module_1 = require("./modules/storage/storage.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            stripe_module_1.StripeModule,
            notification_module_1.NotificationModule,
            health_module_1.HealthModule,
            sentry_module_1.SentryModule,
            storage_module_1.StorageModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            teams_module_1.TeamsModule,
            tournaments_module_1.TournamentsModule,
            registrations_module_1.RegistrationsModule,
            brackets_module_1.BracketsModule,
            matches_module_1.MatchesModule,
            ranking_module_1.RankingModule,
            friendlies_module_1.FriendliesModule,
            chat_module_1.ChatModule,
            notifications_module_1.NotificationsModule,
            home_module_1.HomeModule,
            admin_module_1.AdminModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map