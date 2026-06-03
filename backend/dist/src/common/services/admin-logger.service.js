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
exports.AdminLoggerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AdminLoggerService = class AdminLoggerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(level, message, source, stack, metadata) {
        await this.prisma.adminLog.create({
            data: {
                level,
                message,
                source: source ?? null,
                stack: stack ?? null,
                metadata: metadata ?? undefined,
            },
        });
    }
    info(message, source, metadata) {
        return this.log('INFO', message, source, undefined, metadata);
    }
    warn(message, source, metadata) {
        return this.log('WARN', message, source, undefined, metadata);
    }
    error(message, source, stack, metadata) {
        return this.log('ERROR', message, source, stack, metadata);
    }
    async cleanup(retentionDays = 90) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - retentionDays);
        await this.prisma.adminLog.deleteMany({
            where: { createdAt: { lt: cutoff } },
        });
    }
};
exports.AdminLoggerService = AdminLoggerService;
exports.AdminLoggerService = AdminLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminLoggerService);
//# sourceMappingURL=admin-logger.service.js.map