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
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_controller_1 = require("./chat.controller");
const chat_service_1 = require("./chat.service");
const chat_gateway_1 = require("./chat.gateway");
const teams_service_1 = require("../teams/teams.service");
const friendlies_service_1 = require("../friendlies/friendlies.service");
const redis_module_1 = require("../../common/redis/redis.module");
const teams_module_1 = require("../teams/teams.module");
const friendlies_module_1 = require("../friendlies/friendlies.module");
let ChatModule = class ChatModule {
    chatService;
    teamsService;
    friendliesService;
    constructor(chatService, teamsService, friendliesService) {
        this.chatService = chatService;
        this.teamsService = teamsService;
        this.friendliesService = friendliesService;
    }
    onModuleInit() {
        this.teamsService.setChatService(this.chatService);
        this.friendliesService.setChatService(this.chatService);
    }
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [redis_module_1.RedisModule, teams_module_1.TeamsModule, friendlies_module_1.FriendliesModule],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_service_1.ChatService, chat_gateway_1.ChatGateway],
        exports: [chat_service_1.ChatService],
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        teams_service_1.TeamsService,
        friendlies_service_1.FriendliesService])
], ChatModule);
//# sourceMappingURL=chat.module.js.map