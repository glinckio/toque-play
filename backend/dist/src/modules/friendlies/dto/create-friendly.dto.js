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
exports.CreateFriendlyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateFriendlyDto {
    title;
    description;
    requesterTeamId;
    challengedId;
    challengedTeamId;
    date;
    startTime;
    address;
    addressNumber;
    city;
    state;
    latitude;
    longitude;
    regionRadius;
    modality;
    categoryFormat;
    athleteIds;
    captainId;
}
exports.CreateFriendlyDto = CreateFriendlyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Titulo do amistoso' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Descricao' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do time desafiante' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "requesterTeamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do usuario desafiado' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "challengedId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do time desafiado' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "challengedTeamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data do amistoso' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Horario de inicio' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Endereco' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Numero do endereco' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "addressNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cidade' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estado' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Latitude' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateFriendlyDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Longitude' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateFriendlyDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Raio de abrangencia (km)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateFriendlyDto.prototype, "regionRadius", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Modalidade (BEACH ou COURT)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "modality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Formato da categoria (PAIR, QUARTET, SEXTET)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "categoryFormat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IDs dos atletas (teamMemberIds)' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateFriendlyDto.prototype, "athleteIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do capitão entre os atletas (teamMemberId)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFriendlyDto.prototype, "captainId", void 0);
//# sourceMappingURL=create-friendly.dto.js.map