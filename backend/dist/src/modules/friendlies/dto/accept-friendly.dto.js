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
exports.AcceptFriendlyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AcceptFriendlyDto {
    athleteIds;
    captainId;
}
exports.AcceptFriendlyDto = AcceptFriendlyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'IDs dos atletas do time desafiado (teamMemberIds)', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AcceptFriendlyDto.prototype, "athleteIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do capitão entre os atletas (teamMemberId)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AcceptFriendlyDto.prototype, "captainId", void 0);
//# sourceMappingURL=accept-friendly.dto.js.map