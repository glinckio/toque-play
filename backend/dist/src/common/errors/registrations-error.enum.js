"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsErrorMessages = exports.RegistrationsErrorCode = void 0;
var RegistrationsErrorCode;
(function (RegistrationsErrorCode) {
    RegistrationsErrorCode["REGISTRATION_NOT_FOUND"] = "REGISTRATION_NOT_FOUND";
    RegistrationsErrorCode["NOT_REGISTRATION_OWNER"] = "NOT_REGISTRATION_OWNER";
    RegistrationsErrorCode["TOURNAMENT_NOT_OPEN"] = "TOURNAMENT_NOT_OPEN";
    RegistrationsErrorCode["REGISTRATION_DEADLINE_EXPIRED"] = "REGISTRATION_DEADLINE_EXPIRED";
    RegistrationsErrorCode["TEAM_SIZE_MISMATCH"] = "TEAM_SIZE_MISMATCH";
    RegistrationsErrorCode["NO_SPOTS_AVAILABLE"] = "NO_SPOTS_AVAILABLE";
    RegistrationsErrorCode["TEAM_ALREADY_REGISTERED"] = "TEAM_ALREADY_REGISTERED";
    RegistrationsErrorCode["REGISTRATION_ALREADY_CANCELLED"] = "REGISTRATION_ALREADY_CANCELLED";
    RegistrationsErrorCode["REGISTRATION_ALREADY_CONFIRMED"] = "REGISTRATION_ALREADY_CONFIRMED";
    RegistrationsErrorCode["CANNOT_CANCEL_STARTED"] = "CANNOT_CANCEL_STARTED";
    RegistrationsErrorCode["PAYMENT_REQUIRED"] = "PAYMENT_REQUIRED";
    RegistrationsErrorCode["CATEGORY_NOT_IN_TOURNAMENT"] = "CATEGORY_NOT_IN_TOURNAMENT";
})(RegistrationsErrorCode || (exports.RegistrationsErrorCode = RegistrationsErrorCode = {}));
exports.RegistrationsErrorMessages = {
    [RegistrationsErrorCode.REGISTRATION_NOT_FOUND]: 'Registration not found',
    [RegistrationsErrorCode.NOT_REGISTRATION_OWNER]: 'Only the user who registered can perform this action',
    [RegistrationsErrorCode.TOURNAMENT_NOT_OPEN]: 'Tournament is not open for registration',
    [RegistrationsErrorCode.REGISTRATION_DEADLINE_EXPIRED]: 'Registration deadline has expired',
    [RegistrationsErrorCode.TEAM_SIZE_MISMATCH]: 'Team member count does not match category format',
    [RegistrationsErrorCode.NO_SPOTS_AVAILABLE]: 'No spots available in this category',
    [RegistrationsErrorCode.TEAM_ALREADY_REGISTERED]: 'Team is already registered in this category',
    [RegistrationsErrorCode.REGISTRATION_ALREADY_CANCELLED]: 'Registration is already cancelled',
    [RegistrationsErrorCode.REGISTRATION_ALREADY_CONFIRMED]: 'Registration is already confirmed',
    [RegistrationsErrorCode.CANNOT_CANCEL_STARTED]: 'Cannot cancel registration for a tournament that has already started',
    [RegistrationsErrorCode.PAYMENT_REQUIRED]: 'Payment is required before confirming this registration',
    [RegistrationsErrorCode.CATEGORY_NOT_IN_TOURNAMENT]: 'Category does not belong to this tournament',
};
//# sourceMappingURL=registrations-error.enum.js.map