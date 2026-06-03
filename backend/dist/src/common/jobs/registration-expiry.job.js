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
exports.RegistrationExpiryProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let RegistrationExpiryProcessor = class RegistrationExpiryProcessor {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleExpiry(job) {
        const { registrationId } = job.data;
        const registration = await this.prisma.registration.findUnique({
            where: { id: registrationId },
        });
        if (!registration)
            return;
        if (registration.status !== client_1.RegistrationStatus.PENDING_PAYMENT) {
            return;
        }
        await this.prisma.registration.update({
            where: { id: registrationId },
            data: { status: client_1.RegistrationStatus.CANCELLED },
        });
    }
};
exports.RegistrationExpiryProcessor = RegistrationExpiryProcessor;
__decorate([
    (0, bull_1.Process)('expire'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegistrationExpiryProcessor.prototype, "handleExpiry", null);
exports.RegistrationExpiryProcessor = RegistrationExpiryProcessor = __decorate([
    (0, bull_1.Processor)('registration-expiry'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegistrationExpiryProcessor);
//# sourceMappingURL=registration-expiry.job.js.map