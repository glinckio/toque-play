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
exports.MatchesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_service_1 = require("../../common/redis/redis.service");
let MatchesGateway = class MatchesGateway {
    redisService;
    server;
    constructor(redisService) {
        this.redisService = redisService;
    }
    async afterInit() {
        try {
            const pubClient = this.redisService.getClient().duplicate();
            const subClient = this.redisService.getClient().duplicate();
            this.server.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
        }
        catch {
        }
    }
    handleConnection(client) {
        console.log('[WS] Client connected:', client.id);
    }
    handleDisconnect(client) {
        console.log('[WS] Client disconnected:', client.id);
    }
    handleJoinTournament(client, data) {
        client.join(`tournament:${data.tournamentId}`);
    }
    handleLeaveTournament(client, data) {
        client.leave(`tournament:${data.tournamentId}`);
    }
    handleFriendlyJoin(client, payload) {
        client.join(`friendly:${payload.friendlyId}`);
    }
    handleFriendlyLeave(client, payload) {
        client.leave(`friendly:${payload.friendlyId}`);
    }
    handleMatchJoin(client, payload) {
        console.log('[WS] match:join', payload.matchId, 'client:', client.id);
        client.join(`match:${payload.matchId}`);
    }
    handleMatchLeave(client, payload) {
        client.leave(`match:${payload.matchId}`);
    }
    emitToTournament(tournamentId, event, data) {
        this.server.to(`tournament:${tournamentId}`).emit(event, data);
    }
    emitToFriendly(friendlyId, event, data) {
        this.server.to(`friendly:${friendlyId}`).emit(event, data);
    }
    emitToMatch(matchId, event, data) {
        this.server.to(`match:${matchId}`).emit(event, data);
    }
};
exports.MatchesGateway = MatchesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MatchesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('tournament:join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MatchesGateway.prototype, "handleJoinTournament", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('tournament:leave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MatchesGateway.prototype, "handleLeaveTournament", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('friendly:join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MatchesGateway.prototype, "handleFriendlyJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('friendly:leave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MatchesGateway.prototype, "handleFriendlyLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('match:join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MatchesGateway.prototype, "handleMatchJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('match:leave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MatchesGateway.prototype, "handleMatchLeave", null);
exports.MatchesGateway = MatchesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], MatchesGateway);
//# sourceMappingURL=matches.gateway.js.map