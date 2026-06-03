"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const auth_error_enum_1 = require("../errors/auth-error.enum");
const teams_error_enum_1 = require("../errors/teams-error.enum");
const tournaments_error_enum_1 = require("../errors/tournaments-error.enum");
const registrations_error_enum_1 = require("../errors/registrations-error.enum");
const brackets_error_enum_1 = require("../errors/brackets-error.enum");
const matches_error_enum_1 = require("../errors/matches-error.enum");
const friendlies_error_enum_1 = require("../errors/friendlies-error.enum");
const allErrorMessages = {
    ...auth_error_enum_1.AuthErrorMessages,
    ...teams_error_enum_1.TeamsErrorMessages,
    ...tournaments_error_enum_1.TournamentsErrorMessages,
    ...registrations_error_enum_1.RegistrationsErrorMessages,
    ...brackets_error_enum_1.BracketsErrorMessages,
    ...matches_error_enum_1.MatchesErrorMessages,
    ...friendlies_error_enum_1.FriendliesErrorMessages,
};
let AppExceptionFilter = class AppExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const excResponse = exception.getResponse();
            let code;
            let message;
            if (typeof excResponse === 'object' && excResponse !== null) {
                const obj = excResponse;
                code = obj.code;
                message = obj.message;
            }
            if (code && allErrorMessages[code]) {
                return response.status(status).json({
                    statusCode: status,
                    code,
                    message: allErrorMessages[code],
                });
            }
            return response.status(status).json({
                statusCode: status,
                message: message || exception.message,
            });
        }
        const message = exception instanceof Error ? exception.message : 'Internal server error';
        console.error('[Unhandled Exception]', exception);
        return response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message,
        });
    }
};
exports.AppExceptionFilter = AppExceptionFilter;
exports.AppExceptionFilter = AppExceptionFilter = __decorate([
    (0, common_1.Catch)()
], AppExceptionFilter);
//# sourceMappingURL=app-exception.filter.js.map