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
exports.BracketsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const brackets_service_1 = require("./brackets.service");
const generate_bracket_dto_1 = require("./dto/generate-bracket.dto");
let BracketsController = class BracketsController {
    bracketsService;
    constructor(bracketsService) {
        this.bracketsService = bracketsService;
    }
    async generateBracket(tournamentId, userId, dto) {
        return this.bracketsService.generateBracket(tournamentId, userId, dto);
    }
    async getBracket(tournamentId, categoryId) {
        return this.bracketsService.getBracket(tournamentId, categoryId);
    }
};
exports.BracketsController = BracketsController;
__decorate([
    (0, common_1.Post)(':id/generate-bracket'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Gerar chaveamento para uma categoria' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chaveamento gerado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, generate_bracket_dto_1.GenerateBracketDto]),
    __metadata("design:returntype", Promise)
], BracketsController.prototype, "generateBracket", null);
__decorate([
    (0, common_1.Get)(':id/bracket'),
    (0, swagger_1.ApiOperation)({ summary: 'Visualizar chaveamento do torneio' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, description: 'Filtrar por categoria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chaveamento retornado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BracketsController.prototype, "getBracket", null);
exports.BracketsController = BracketsController = __decorate([
    (0, swagger_1.ApiTags)('Brackets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('tournaments'),
    __metadata("design:paramtypes", [brackets_service_1.BracketsService])
], BracketsController);
//# sourceMappingURL=brackets.controller.js.map