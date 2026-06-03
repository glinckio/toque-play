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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullBoardMiddleware = void 0;
const common_1 = require("@nestjs/common");
const api_1 = require("@bull-board/api");
const bullAdapter_1 = require("@bull-board/api/bullAdapter");
const express_1 = require("@bull-board/express");
const bull_1 = __importDefault(require("bull"));
let BullBoardMiddleware = class BullBoardMiddleware {
    router;
    constructor() {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
        const registrationExpiryQueue = new bull_1.default('registration-expiry', {
            redis: { host: redisHost, port: redisPort },
        });
        const serverAdapter = new express_1.ExpressAdapter();
        serverAdapter.setBasePath('/api/admin/queues');
        (0, api_1.createBullBoard)({
            queues: [new bullAdapter_1.BullAdapter(registrationExpiryQueue)],
            serverAdapter,
        });
        this.router = serverAdapter.getRouter();
    }
    use(req, res, next) {
        return this.router(req, res, next);
    }
};
exports.BullBoardMiddleware = BullBoardMiddleware;
exports.BullBoardMiddleware = BullBoardMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BullBoardMiddleware);
//# sourceMappingURL=bull-board.middleware.js.map