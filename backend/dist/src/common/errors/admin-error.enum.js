"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminErrorMessages = exports.AdminErrorCode = void 0;
var AdminErrorCode;
(function (AdminErrorCode) {
    AdminErrorCode["USER_ALREADY_BLOCKED"] = "USER_ALREADY_BLOCKED";
    AdminErrorCode["USER_ALREADY_ACTIVE"] = "USER_ALREADY_ACTIVE";
    AdminErrorCode["TOURNAMENT_ALREADY_DELETED"] = "TOURNAMENT_ALREADY_DELETED";
    AdminErrorCode["MAINTENANCE_ALREADY_ON"] = "MAINTENANCE_ALREADY_ON";
    AdminErrorCode["MAINTENANCE_ALREADY_OFF"] = "MAINTENANCE_ALREADY_OFF";
})(AdminErrorCode || (exports.AdminErrorCode = AdminErrorCode = {}));
exports.AdminErrorMessages = {
    [AdminErrorCode.USER_ALREADY_BLOCKED]: 'User is already blocked',
    [AdminErrorCode.USER_ALREADY_ACTIVE]: 'User is already active',
    [AdminErrorCode.TOURNAMENT_ALREADY_DELETED]: 'Tournament is already deleted',
    [AdminErrorCode.MAINTENANCE_ALREADY_ON]: 'Maintenance mode is already ON',
    [AdminErrorCode.MAINTENANCE_ALREADY_OFF]: 'Maintenance mode is already OFF',
};
//# sourceMappingURL=admin-error.enum.js.map