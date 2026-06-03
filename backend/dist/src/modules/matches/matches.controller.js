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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const matches_service_1 = require("./matches.service");
const point_dto_1 = require("./dto/point.dto");
const set_finish_dto_1 = require("./dto/set-finish.dto");
const walkover_dto_1 = require("./dto/walkover.dto");
const timeout_dto_1 = require("./dto/timeout.dto");
const substitution_dto_1 = require("./dto/substitution.dto");
const nearby_query_dto_1 = require("./dto/nearby-query.dto");
let MatchesController = class MatchesController {
    matchesService;
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    findNearby(query) {
        return this.matchesService.findNearby(query);
    }
    async enterRefereeCode(userId, body) {
        return this.matchesService.enterRefereeCode(userId, body.code);
    }
    async findOne(matchId, userId) {
        return this.matchesService.findOne(matchId, userId);
    }
    async getTimeline(matchId) {
        return this.matchesService.getTimeline(matchId);
    }
    async generateRefereeCode(matchId, userId) {
        return this.matchesService.generateRefereeCode(matchId, userId);
    }
    async startMatch(matchId, userId) {
        return this.matchesService.startMatch(matchId, userId);
    }
    async registerPoint(matchId, userId, dto) {
        return this.matchesService.registerPoint(matchId, userId, dto);
    }
    async removePoint(matchId, userId, dto) {
        return this.matchesService.removePoint(matchId, userId, dto);
    }
    async finishSet(matchId, userId, dto) {
        return this.matchesService.finishSet(matchId, userId, dto);
    }
    async finishMatch(matchId, userId) {
        return this.matchesService.finishMatch(matchId, userId);
    }
    async declareWalkover(matchId, userId, dto) {
        return this.matchesService.declareWalkover(matchId, userId, dto);
    }
    async registerTimeout(matchId, userId, dto) {
        return this.matchesService.registerTimeout(matchId, userId, dto);
    }
    async registerSubstitution(matchId, userId, dto) {
        return this.matchesService.registerSubstitution(matchId, userId, dto);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Find live matches near user location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nearby live matches' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nearby_query_dto_1.NearbyQueryDto]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Post)('referee-enter'),
    (0, swagger_1.ApiOperation)({ summary: 'Enter referee code to become match referee' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Referee assigned to match' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "enterRefereeCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Find match by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/timeline'),
    (0, swagger_1.ApiOperation)({ summary: 'Get match timeline (points + events)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match timeline' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Post)(':id/generate-referee-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate referee code for a match' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Referee code generated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "generateRefereeCode", null);
__decorate([
    (0, common_1.Patch)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar partida' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Partida iniciada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "startMatch", null);
__decorate([
    (0, common_1.Patch)(':id/point'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar ponto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ponto registrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, point_dto_1.PointDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "registerPoint", null);
__decorate([
    (0, common_1.Patch)(':id/remove-point'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover ponto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ponto removido' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, point_dto_1.PointDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "removePoint", null);
__decorate([
    (0, common_1.Patch)(':id/set-finish'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar set' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Set finalizado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, set_finish_dto_1.SetFinishDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "finishSet", null);
__decorate([
    (0, common_1.Patch)(':id/finish'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar partida' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Partida finalizada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "finishMatch", null);
__decorate([
    (0, common_1.Patch)(':id/walkover'),
    (0, swagger_1.ApiOperation)({ summary: 'Declarar W.O.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'W.O. declarado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, walkover_dto_1.WalkoverDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "declareWalkover", null);
__decorate([
    (0, common_1.Patch)(':id/timeout'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar tempo técnico (timeout)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Timeout registrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, timeout_dto_1.TimeoutDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "registerTimeout", null);
__decorate([
    (0, common_1.Patch)(':id/substitution'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar substituição de jogador' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Substituição registrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, substitution_dto_1.SubstitutionDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "registerSubstitution", null);
exports.MatchesController = MatchesController = __decorate([
    (0, swagger_1.ApiTags)('Matches'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('matches'),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map