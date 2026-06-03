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
exports.TeamMembersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const team_members_service_1 = require("./team-members.service");
const add_member_dto_1 = require("./dto/add-member.dto");
const add_guest_dto_1 = require("./dto/add-guest.dto");
const update_member_dto_1 = require("./dto/update-member.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let TeamMembersController = class TeamMembersController {
    membersService;
    constructor(membersService) {
        this.membersService = membersService;
    }
    async addMember(teamId, userId, dto) {
        return this.membersService.addMember(teamId, userId, dto);
    }
    async addGuest(teamId, userId, dto) {
        return this.membersService.addGuest(teamId, userId, dto);
    }
    async findAll(teamId, userId) {
        return this.membersService.findAll(teamId, userId);
    }
    async update(teamId, memberId, userId, dto) {
        return this.membersService.update(teamId, memberId, userId, dto);
    }
    async remove(teamId, memberId, userId) {
        await this.membersService.remove(teamId, memberId, userId);
    }
};
exports.TeamMembersController = TeamMembersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar membro por email' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Membro adicionado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario nao encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Usuario ja e membro ou CPF duplicado' }),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_member_dto_1.AddMemberDto]),
    __metadata("design:returntype", Promise)
], TeamMembersController.prototype, "addMember", null);
__decorate([
    (0, common_1.Post)('guest'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar convidado externo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Convidado adicionado' }),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_guest_dto_1.AddGuestDto]),
    __metadata("design:returntype", Promise)
], TeamMembersController.prototype, "addGuest", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar elenco do time' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de membros' }),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeamMembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Editar membro (capitania)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membro atualizado' }),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_member_dto_1.UpdateMemberDto]),
    __metadata("design:returntype", Promise)
], TeamMembersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':memberId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remover membro do time' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Membro removido' }),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TeamMembersController.prototype, "remove", null);
exports.TeamMembersController = TeamMembersController = __decorate([
    (0, swagger_1.ApiTags)('Team Members'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('teams/:teamId/members'),
    __metadata("design:paramtypes", [team_members_service_1.TeamMembersService])
], TeamMembersController);
//# sourceMappingURL=team-members.controller.js.map