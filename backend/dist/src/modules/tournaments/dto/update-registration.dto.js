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
exports.UpdateRegistrationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class UpdateRegistrationDto {
    maxTeams;
    registrationPrice;
    registrationDeadline;
    registrationRules;
}
exports.UpdateRegistrationDto = UpdateRegistrationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximo de times' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(2),
    __metadata("design:type", Number)
], UpdateRegistrationDto.prototype, "maxTeams", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preco da inscricao' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateRegistrationDto.prototype, "registrationPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Prazo de inscricao' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRegistrationDto.prototype, "registrationDeadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Regras de inscricao' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], UpdateRegistrationDto.prototype, "registrationRules", void 0);
//# sourceMappingURL=update-registration.dto.js.map