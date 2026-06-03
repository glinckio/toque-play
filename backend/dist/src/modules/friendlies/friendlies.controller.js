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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendliesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const friendlies_service_1 = require("./friendlies.service");
const create_friendly_dto_1 = require("./dto/create-friendly.dto");
const accept_friendly_dto_1 = require("./dto/accept-friendly.dto");
const query_friendly_dto_1 = require("./dto/query-friendly.dto");
let FriendliesController = class FriendliesController {
    friendliesService;
    constructor(friendliesService) {
        this.friendliesService = friendliesService;
    }
    async create(userId, dto) {
        return this.friendliesService.create(userId, dto);
    }
    async findNearby(query) {
        return this.friendliesService.findNearby(query);
    }
    async explore(query) {
        return this.friendliesService.explore(query);
    }
    async findMine(userId, query) {
        return this.friendliesService.findMine(userId, query);
    }
    async enterRefereeCode(userId, code) {
        return this.friendliesService.enterRefereeCode(userId, code);
    }
    async findOne(friendlyId, userId) {
        return this.friendliesService.findOne(friendlyId, userId);
    }
    async accept(friendlyId, userId, dto) {
        return this.friendliesService.accept(friendlyId, userId, dto);
    }
    async reject(friendlyId, userId) {
        return this.friendliesService.reject(friendlyId, userId);
    }
    async cancel(friendlyId, userId) {
        return this.friendliesService.cancel(friendlyId, userId);
    }
    async selectAthletes(friendlyId, userId, athleteIds) {
        return this.friendliesService.selectAthletes(friendlyId, userId, athleteIds);
    }
    async generateRefereeCode(friendlyId, userId) {
        return this.friendliesService.generateRefereeCode(friendlyId, userId);
    }
};
exports.FriendliesController = FriendliesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar solicitacao de amistoso' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Amistoso criado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_friendly_dto_1.CreateFriendlyDto]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar amistosos proximos (geolocalizacao)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_friendly_dto_1.NearbyQueryDto]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Get)('explore'),
    (0, swagger_1.ApiOperation)({ summary: 'Explorar amistosos abertos na regiao' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "explore", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar meus amistosos' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_friendly_dto_1.QueryFriendlyDto]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "findMine", null);
__decorate([
    (0, common_1.Post)('referee-enter'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Entrar com codigo de arbitro' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "enterRefereeCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalhes do amistoso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Aceitar amistoso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, accept_friendly_dto_1.AcceptFriendlyDto]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Rejeitar amistoso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar amistoso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/select-athletes'),
    (0, swagger_1.ApiOperation)({ summary: 'Selecionar atletas do time desafiado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)('athleteIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "selectAthletes", null);
__decorate([
    (0, common_1.Post)(':id/generate-referee-code'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Gerar codigo de arbitro para amistoso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendliesController.prototype, "generateRefereeCode", null);
exports.FriendliesController = FriendliesController = __decorate([
    (0, swagger_1.ApiTags)('Friendlies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('friendlies'),
    __metadata("design:paramtypes", [friendlies_service_1.FriendliesService])
], FriendliesController);
//# sourceMappingURL=friendlies.controller.js.map