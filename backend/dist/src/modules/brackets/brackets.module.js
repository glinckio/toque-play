"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BracketsModule = void 0;
const common_1 = require("@nestjs/common");
const brackets_controller_1 = require("./brackets.controller");
const brackets_service_1 = require("./brackets.service");
const tournaments_module_1 = require("../tournaments/tournaments.module");
let BracketsModule = class BracketsModule {
};
exports.BracketsModule = BracketsModule;
exports.BracketsModule = BracketsModule = __decorate([
    (0, common_1.Module)({
        imports: [tournaments_module_1.TournamentsModule],
        controllers: [brackets_controller_1.BracketsController],
        providers: [brackets_service_1.BracketsService],
        exports: [brackets_service_1.BracketsService],
    })
], BracketsModule);
//# sourceMappingURL=brackets.module.js.map