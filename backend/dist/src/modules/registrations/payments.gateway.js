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
exports.PaymentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const registrations_service_1 = require("./registrations.service");
let PaymentsGateway = class PaymentsGateway {
    registrationsService;
    server;
    constructor(registrationsService) {
        this.registrationsService = registrationsService;
    }
    afterInit() {
        this.registrationsService.setPaymentsGateway(this);
    }
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            client.join(`user:${userId}`);
        }
    }
    handleDisconnect(_client) {
    }
    emitPaymentConfirmed(userId, registrationId) {
        this.server.to(`user:${userId}`).emit('payment:confirmed', { registrationId });
    }
};
exports.PaymentsGateway = PaymentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], PaymentsGateway.prototype, "server", void 0);
exports.PaymentsGateway = PaymentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/payments',
    }),
    __metadata("design:paramtypes", [registrations_service_1.RegistrationsService])
], PaymentsGateway);
//# sourceMappingURL=payments.gateway.js.map