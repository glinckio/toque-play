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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const admin_service_1 = require("./admin.service");
const query_users_dto_1 = require("./dto/query-users.dto");
const query_admin_tournaments_dto_1 = require("./dto/query-admin-tournaments.dto");
const query_logs_dto_1 = require("./dto/query-logs.dto");
const query_metrics_dto_1 = require("./dto/query-metrics.dto");
const update_system_dto_1 = require("./dto/update-system.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboard() {
        return this.adminService.getDashboard();
    }
    listUsers(query) {
        return this.adminService.listUsers(query);
    }
    blockUser(id) {
        return this.adminService.blockUser(id);
    }
    unblockUser(id) {
        return this.adminService.unblockUser(id);
    }
    listTournaments(query) {
        return this.adminService.listTournaments(query);
    }
    blockTournament(id) {
        return this.adminService.blockTournament(id);
    }
    deleteTournament(id) {
        return this.adminService.deleteTournament(id);
    }
    getLogs(query) {
        return this.adminService.getLogs(query);
    }
    getMonitoring() {
        return this.adminService.getMonitoring();
    }
    getSystem() {
        return this.adminService.getSystem();
    }
    updateSystem(dto) {
        return this.adminService.updateSystem(dto);
    }
    getMetrics(query) {
        return this.adminService.getMetrics(query);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard KPIs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'List all users with search and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated user list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_users_dto_1.QueryUsersDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/block'),
    (0, swagger_1.ApiOperation)({ summary: 'Block a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User blocked' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/unblock'),
    (0, swagger_1.ApiOperation)({ summary: 'Unblock a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User unblocked' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Get)('tournaments'),
    (0, swagger_1.ApiOperation)({ summary: 'List all tournaments with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated tournament list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_admin_tournaments_dto_1.QueryAdminTournamentsDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listTournaments", null);
__decorate([
    (0, common_1.Patch)('tournaments/:id/block'),
    (0, swagger_1.ApiOperation)({ summary: 'Block/flag a tournament' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tournament blocked' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "blockTournament", null);
__decorate([
    (0, common_1.Delete)('tournaments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a tournament' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tournament soft-deleted' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteTournament", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Query error logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of logs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_logs_dto_1.QueryLogsDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('monitoring'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system monitoring data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Monitoring stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMonitoring", null);
__decorate([
    (0, common_1.Get)('system'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSystem", null);
__decorate([
    (0, common_1.Patch)('system'),
    (0, swagger_1.ApiOperation)({ summary: 'Update system settings (maintenance mode, global message)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Updated system settings' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_system_dto_1.UpdateSystemDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateSystem", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metrics data' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_metrics_dto_1.QueryMetricsDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMetrics", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map