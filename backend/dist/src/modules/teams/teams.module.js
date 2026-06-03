"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsModule = void 0;
const common_1 = require("@nestjs/common");
const teams_controller_1 = require("./teams.controller");
const teams_service_1 = require("./teams.service");
const team_members_controller_1 = require("./team-members.controller");
const team_members_service_1 = require("./team-members.service");
const team_invitations_controller_1 = require("./team-invitations.controller");
const cpf_service_1 = require("../../common/services/cpf.service");
let TeamsModule = class TeamsModule {
};
exports.TeamsModule = TeamsModule;
exports.TeamsModule = TeamsModule = __decorate([
    (0, common_1.Module)({
        controllers: [teams_controller_1.TeamsController, team_members_controller_1.TeamMembersController, team_invitations_controller_1.TeamInvitationsController],
        providers: [teams_service_1.TeamsService, team_members_service_1.TeamMembersService, cpf_service_1.CpfService],
        exports: [teams_service_1.TeamsService, team_members_service_1.TeamMembersService],
    })
], TeamsModule);
//# sourceMappingURL=teams.module.js.map