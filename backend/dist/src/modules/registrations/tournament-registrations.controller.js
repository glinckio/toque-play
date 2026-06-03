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
exports.TournamentRegistrationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const registrations_service_1 = require("./registrations.service");
const register_team_dto_1 = require("./dto/register-team.dto");
const query_registrations_dto_1 = require("./dto/query-registrations.dto");
let TournamentRegistrationsController = class TournamentRegistrationsController {
    registrationsService;
    constructor(registrationsService) {
        this.registrationsService = registrationsService;
    }
    async registerTeam(tournamentId, userId, dto) {
        return this.registrationsService.registerTeam(tournamentId, userId, dto);
    }
    async listRegistrations(tournamentId, userId, query) {
        return this.registrationsService.listByTournament(tournamentId, userId, query);
    }
    async getRegisteredMembers(tournamentId, teamId) {
        return this.registrationsService.getRegisteredMembers(tournamentId, teamId);
    }
    async confirmRegistration(tournamentId, regId, userId) {
        return this.registrationsService.confirmRegistration(tournamentId, regId, userId);
    }
    async rejectRegistration(tournamentId, regId, userId) {
        return this.registrationsService.rejectRegistration(tournamentId, regId, userId);
    }
};
exports.TournamentRegistrationsController = TournamentRegistrationsController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Inscrever time em uma categoria' }),
    __param(0, (0, common_1.Param)('tournamentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, register_team_dto_1.RegisterTeamDto]),
    __metadata("design:returntype", Promise)
], TournamentRegistrationsController.prototype, "registerTeam", null);
__decorate([
    (0, common_1.Get)('registrations'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar inscricoes do torneio (owner)' }),
    __param(0, (0, common_1.Param)('tournamentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, query_registrations_dto_1.QueryRegistrationsDto]),
    __metadata("design:returntype", Promise)
], TournamentRegistrationsController.prototype, "listRegistrations", null);
__decorate([
    (0, common_1.Get)('registered-members'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar IDs dos membros já inscritos de um time neste torneio' }),
    __param(0, (0, common_1.Param)('tournamentId')),
    __param(1, (0, common_1.Query)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentRegistrationsController.prototype, "getRegisteredMembers", null);
__decorate([
    (0, common_1.Patch)('registrations/:regId/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirmar inscricao (owner)' }),
    __param(0, (0, common_1.Param)('tournamentId')),
    __param(1, (0, common_1.Param)('regId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TournamentRegistrationsController.prototype, "confirmRegistration", null);
__decorate([
    (0, common_1.Patch)('registrations/:regId/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Rejeitar inscricao (owner)' }),
    __param(0, (0, common_1.Param)('tournamentId')),
    __param(1, (0, common_1.Param)('regId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TournamentRegistrationsController.prototype, "rejectRegistration", null);
exports.TournamentRegistrationsController = TournamentRegistrationsController = __decorate([
    (0, swagger_1.ApiTags)('Tournament Registrations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('tournaments/:tournamentId'),
    __metadata("design:paramtypes", [registrations_service_1.RegistrationsService])
], TournamentRegistrationsController);
//# sourceMappingURL=tournament-registrations.controller.js.map