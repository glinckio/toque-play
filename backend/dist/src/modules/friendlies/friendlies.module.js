"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendliesModule = void 0;
const common_1 = require("@nestjs/common");
const friendlies_controller_1 = require("./friendlies.controller");
const friendlies_service_1 = require("./friendlies.service");
let FriendliesModule = class FriendliesModule {
};
exports.FriendliesModule = FriendliesModule;
exports.FriendliesModule = FriendliesModule = __decorate([
    (0, common_1.Module)({
        controllers: [friendlies_controller_1.FriendliesController],
        providers: [friendlies_service_1.FriendliesService],
        exports: [friendlies_service_1.FriendliesService],
    })
], FriendliesModule);
//# sourceMappingURL=friendlies.module.js.map