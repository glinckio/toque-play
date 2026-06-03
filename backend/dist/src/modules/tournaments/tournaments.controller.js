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
exports.TournamentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const tournaments_service_1 = require("./tournaments.service");
const create_tournament_dto_1 = require("./dto/create-tournament.dto");
const update_structure_dto_1 = require("./dto/update-structure.dto");
const add_facilities_dto_1 = require("./dto/add-facilities.dto");
const add_sponsors_dto_1 = require("./dto/add-sponsors.dto");
const query_tournaments_dto_1 = require("./dto/query-tournaments.dto");
const explore_query_dto_1 = require("./dto/explore-query.dto");
const client_1 = require("@prisma/client");
let TournamentsController = class TournamentsController {
    tournamentsService;
    constructor(tournamentsService) {
        this.tournamentsService = tournamentsService;
    }
    async create(userId, dto) {
        return this.tournamentsService.create(userId, dto);
    }
    async update(id, userId, dto) {
        return this.tournamentsService.update(id, userId, dto);
    }
    async updateStructure(id, userId, dto) {
        return this.tournamentsService.updateStructure(id, userId, dto);
    }
    async addStageFacilities(id, stageId, userId, dto) {
        return this.tournamentsService.addStageFacilities(id, stageId, userId, dto.facilities);
    }
    async removeStageFacility(id, stageId, facilityId, userId) {
        await this.tournamentsService.removeStageFacility(id, stageId, facilityId, userId);
    }
    async addSponsors(id, userId, dto) {
        return this.tournamentsService.addSponsors(id, userId, dto);
    }
    async removeSponsor(id, sponsorId, userId) {
        await this.tournamentsService.removeSponsor(id, sponsorId, userId);
    }
    async getSummary(id, userId) {
        return this.tournamentsService.getSummary(id, userId);
    }
    async publish(id, userId) {
        return this.tournamentsService.publish(id, userId);
    }
    async startTournament(id, userId) {
        return this.tournamentsService.startTournament(id, userId);
    }
    async generateRefereeCode(id, userId) {
        return this.tournamentsService.generateRefereeCode(id, userId);
    }
    async enterRefereeCode(userId, code) {
        return this.tournamentsService.enterRefereeCode(userId, code);
    }
    async addReferee(id, userId, email) {
        return this.tournamentsService.addReferee(id, userId, email);
    }
    async removeReferee(id, refereeId, userId) {
        await this.tournamentsService.removeReferee(id, userId, refereeId);
    }
    async getReferees(id) {
        return this.tournamentsService.getReferees(id);
    }
    async saveAsDraft(id, userId) {
        return this.tournamentsService.saveAsDraft(id, userId);
    }
    async findMine(userId) {
        return this.tournamentsService.findMine(userId);
    }
    async findRefereeMine(userId) {
        return this.tournamentsService.findRefereeTournaments(userId);
    }
    async explore(query) {
        if (query.latitude && query.longitude) {
            return this.tournamentsService.exploreWithNearby(query);
        }
        const items = await this.tournamentsService.explore(query);
        const hasMore = items.length > (query.limit || 20);
        const data = hasMore ? items.slice(0, -1) : items;
        return {
            nearby: [],
            all: data,
            hasMore,
            nextCursor: hasMore ? data[data.length - 1]?.id : null,
        };
    }
    async findAll(query) {
        return this.tournamentsService.findAll(query);
    }
    async findOne(id) {
        return this.tournamentsService.findOne(id);
    }
    async getPublicDetails(id, userId) {
        return this.tournamentsService.getPublicDetails(id, userId);
    }
    async cancel(id, userId) {
        await this.tournamentsService.cancel(id, userId);
    }
};
exports.TournamentsController = TournamentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)('ORGANIZADOR', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar torneio (rascunho)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Torneio criado como DRAFT' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_tournament_dto_1.CreateTournamentDto]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar dados basicos do torneio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_tournament_dto_1.CreateTournamentDto]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/structure'),
    (0, swagger_1.ApiOperation)({ summary: 'Etapa 2 - Definir estrutura do evento' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Somente o owner pode editar' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_structure_dto_1.UpdateStructureDto]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "updateStructure", null);
__decorate([
    (0, common_1.Post)(':id/stages/:stageId/facilities'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Etapa 5 - Adicionar facilities a uma etapa' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('stageId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, add_facilities_dto_1.AddFacilitiesDto]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "addStageFacilities", null);
__decorate([
    (0, common_1.Delete)(':id/stages/:stageId/facilities/:facilityId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remover facility de uma etapa' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('stageId')),
    __param(2, (0, common_1.Param)('facilityId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "removeStageFacility", null);
__decorate([
    (0, common_1.Post)(':id/sponsors'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Etapa 6 - Adicionar patrocinadores' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_sponsors_dto_1.AddSponsorsDto]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "addSponsors", null);
__decorate([
    (0, common_1.Delete)(':id/sponsors/:sponsorId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remover patrocinador' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('sponsorId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "removeSponsor", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Etapa 7 - Resumo do torneio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publicar torneio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "publish", null);
__decorate([
    (0, common_1.Patch)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar torneio (muda status para IN_PROGRESS)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "startTournament", null);
__decorate([
    (0, common_1.Post)(':id/generate-referee-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Gerar código de arbitro para o torneio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "generateRefereeCode", null);
__decorate([
    (0, common_1.Post)('referee-enter'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Entrar como arbitro usando código' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "enterRefereeCode", null);
__decorate([
    (0, common_1.Post)(':id/referees'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar arbitro ao torneio por email' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "addReferee", null);
__decorate([
    (0, common_1.Delete)(':id/referees/:refereeId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remover arbitro do torneio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('refereeId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "removeReferee", null);
__decorate([
    (0, common_1.Get)(':id/referees'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar arbitros do torneio' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "getReferees", null);
__decorate([
    (0, common_1.Patch)(':id/draft'),
    (0, swagger_1.ApiOperation)({ summary: 'Salvar como rascunho' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "saveAsDraft", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, swagger_1.ApiOperation)({ summary: 'Meus torneios' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)('referee-mine'),
    (0, swagger_1.ApiOperation)({ summary: 'Torneios onde sou arbitro' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "findRefereeMine", null);
__decorate([
    (0, common_1.Get)('explore'),
    (0, swagger_1.ApiOperation)({ summary: 'Explorar torneios com filtros avançados' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [explore_query_dto_1.ExploreQueryDto]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "explore", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar torneios com filtros' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.TournamentStatus }),
    (0, swagger_1.ApiQuery)({ name: 'categoryType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'categoryFormat', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'categoryModality', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_tournaments_dto_1.QueryTournamentsDto]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalhes do torneio' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/public'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalhes públicos do torneio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "getPublicDetails", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar torneio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "cancel", null);
exports.TournamentsController = TournamentsController = __decorate([
    (0, swagger_1.ApiTags)('Tournaments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('tournaments'),
    __metadata("design:paramtypes", [tournaments_service_1.TournamentsService])
], TournamentsController);
//# sourceMappingURL=tournaments.controller.js.map