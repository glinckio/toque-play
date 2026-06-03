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
exports.TeamInvitationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const team_members_service_1 = require("./team-members.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let TeamInvitationsController = class TeamInvitationsController {
    membersService;
    constructor(membersService) {
        this.membersService = membersService;
    }
    async findPending(userId) {
        return this.membersService.findPendingInvitations(userId);
    }
    async accept(invitationId, userId) {
        return this.membersService.acceptInvitation(invitationId, userId);
    }
    async reject(invitationId, userId) {
        return this.membersService.rejectInvitation(invitationId, userId);
    }
};
exports.TeamInvitationsController = TeamInvitationsController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar convites pendentes do usuario logado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de convites pendentes' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamInvitationsController.prototype, "findPending", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Aceitar convite para time' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Convite aceito' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Convite nao encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Usuario nao e o convidado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeamInvitationsController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Recusar convite para time' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Convite recusado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Convite nao encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Usuario nao e o convidado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeamInvitationsController.prototype, "reject", null);
exports.TeamInvitationsController = TeamInvitationsController = __decorate([
    (0, swagger_1.ApiTags)('Team Invitations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('team-invitations'),
    __metadata("design:paramtypes", [team_members_service_1.TeamMembersService])
], TeamInvitationsController);
//# sourceMappingURL=team-invitations.controller.js.map