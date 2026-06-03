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
exports.UpdateStructureDto = exports.CategoryDto = exports.StageDto = exports.FacilityDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class FacilityDto {
    name;
    available;
}
exports.FacilityDto = FacilityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome da facility' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], FacilityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Disponivel' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FacilityDto.prototype, "available", void 0);
class StageDto {
    name;
    date;
    startTime;
    maxTeams;
    address;
    street;
    number;
    neighborhood;
    cep;
    city;
    state;
    latitude;
    longitude;
    regionRadius;
    facilities;
}
exports.StageDto = StageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nome da etapa' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], StageDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data da etapa' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StageDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Horario de inicio' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StageDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximo de times na etapa' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(2),
    __metadata("design:type", Number)
], StageDto.prototype, "maxTeams", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Endereco da etapa' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], StageDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rua' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], StageDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Numero' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], StageDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bairro' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], StageDto.prototype, "neighborhood", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'CEP' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], StageDto.prototype, "cep", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cidade da etapa' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], StageDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estado da etapa' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2),
    __metadata("design:type", String)
], StageDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Latitude' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], StageDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Longitude' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], StageDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Raio de abrangencia em km' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], StageDto.prototype, "regionRadius", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facilities da etapa', type: [FacilityDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FacilityDto),
    __metadata("design:type", Array)
], StageDto.prototype, "facilities", void 0);
class CategoryDto {
    type;
    format;
    modality;
    minMembers;
    maxMembers;
    bestOfSets;
    startTime;
    registrationPrice;
    registrationDeadline;
    registrationRules;
    tiebreakerCriteria;
    bracketType;
    groupsCount;
    teamsPerGroup;
    teamsAdvancing;
}
exports.CategoryDto = CategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo', enum: client_1.TournamentType }),
    (0, class_validator_1.IsEnum)(client_1.TournamentType),
    __metadata("design:type", String)
], CategoryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Formato', enum: client_1.TournamentFormat }),
    (0, class_validator_1.IsEnum)(client_1.TournamentFormat),
    __metadata("design:type", String)
], CategoryDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Modalidade', enum: client_1.TournamentModality }),
    (0, class_validator_1.IsEnum)(client_1.TournamentModality),
    __metadata("design:type", String)
], CategoryDto.prototype, "modality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimo de membros por time' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CategoryDto.prototype, "minMembers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximo de membros por time' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CategoryDto.prototype, "maxMembers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Melhor de quantos sets (padrao 3)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CategoryDto.prototype, "bestOfSets", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Horario de inicio' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CategoryDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preco da inscricao' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CategoryDto.prototype, "registrationPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Prazo de inscricao' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CategoryDto.prototype, "registrationDeadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Regras de inscricao' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CategoryDto.prototype, "registrationRules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Criterios de desempate ordenados', example: ['WINS', 'POINT_DIFF', 'POINTS_SCORED', 'HEAD_TO_HEAD'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CategoryDto.prototype, "tiebreakerCriteria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tipo de chaveamento', enum: client_1.BracketType }),
    (0, class_validator_1.IsEnum)(client_1.BracketType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CategoryDto.prototype, "bracketType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Numero de grupos (para GROUPS_THEN_ELIMINATION)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(2),
    __metadata("design:type", Number)
], CategoryDto.prototype, "groupsCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Times por grupo (para GROUPS_THEN_ELIMINATION). Se definido, groupsCount e calculado automaticamente.' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(2),
    __metadata("design:type", Number)
], CategoryDto.prototype, "teamsPerGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Times que avancam por grupo (para GROUPS_THEN_ELIMINATION)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CategoryDto.prototype, "teamsAdvancing", void 0);
class UpdateStructureDto {
    eventType;
    stages;
    categories;
}
exports.UpdateStructureDto = UpdateStructureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo de evento', enum: client_1.TournamentEventType }),
    (0, class_validator_1.IsEnum)(client_1.TournamentEventType),
    __metadata("design:type", String)
], UpdateStructureDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Etapas (obrigatorio se CIRCUIT)', type: [StageDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StageDto),
    __metadata("design:type", Array)
], UpdateStructureDto.prototype, "stages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Categorias', type: [CategoryDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategoryDto),
    __metadata("design:type", Array)
], UpdateStructureDto.prototype, "categories", void 0);
//# sourceMappingURL=update-structure.dto.js.map