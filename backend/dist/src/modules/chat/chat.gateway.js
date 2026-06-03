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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_service_1 = require("../../common/redis/redis.service");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    chatService;
    redisService;
    server;
    constructor(chatService, redisService) {
        this.chatService = chatService;
        this.redisService = redisService;
    }
    async afterInit() {
        const pubClient = this.redisService.getClient().duplicate();
        const subClient = this.redisService.getClient().duplicate();
        this.server.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
    }
    handleConnection(client) {
    }
    handleDisconnect(client) {
    }
    async handleJoinChat(client, data) {
        client.join(`chat:${data.chatId}`);
    }
    handleLeaveChat(client, data) {
        client.leave(`chat:${data.chatId}`);
    }
    async handleMessage(client, data) {
        const message = await this.chatService.sendMessage(data.chatId, data.userId, {
            content: data.content,
        });
        this.server.to(`chat:${data.chatId}`).emit('chat:message', message);
    }
    emitToChat(chatId, event, data) {
        this.server.to(`chat:${chatId}`).emit(event, data);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:leave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        redis_service_1.RedisService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map