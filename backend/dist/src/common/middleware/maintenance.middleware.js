"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceMiddleware = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../redis/redis.service");
let MaintenanceMiddleware = class MaintenanceMiddleware {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async use(req, res, next) {
        const maintenanceFlag = await this.redis.get('system:maintenance');
        if (maintenanceFlag !== 'true') {
            return next();
        }
        const user = req.user;
        if (user && user.role === 'SUPER_ADMIN') {
            return next();
        }
        if (req.path.startsWith('/api/auth/login') || req.path.startsWith('/api/auth/google')) {
            return next();
        }
        const globalMessage = await this.redis.get('system:globalMessage');
        res.status(503).json({
            statusCode: 503,
            code: 'MAINTENANCE_MODE',
            message: globalMessage ?? 'System under maintenance. Please try again later.',
        });
    }
};
exports.MaintenanceMiddleware = MaintenanceMiddleware;
exports.MaintenanceMiddleware = MaintenanceMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], MaintenanceMiddleware);
//# sourceMappingURL=maintenance.middleware.js.map