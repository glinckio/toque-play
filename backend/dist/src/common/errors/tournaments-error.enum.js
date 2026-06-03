"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentsErrorMessages = exports.TournamentsErrorCode = void 0;
var TournamentsErrorCode;
(function (TournamentsErrorCode) {
    TournamentsErrorCode["TOURNAMENT_NOT_FOUND"] = "TOURNAMENT_NOT_FOUND";
    TournamentsErrorCode["NOT_TOURNAMENT_OWNER"] = "NOT_TOURNAMENT_OWNER";
    TournamentsErrorCode["TOURNAMENT_NOT_DRAFT"] = "TOURNAMENT_NOT_DRAFT";
    TournamentsErrorCode["TOURNAMENT_ALREADY_PUBLISHED"] = "TOURNAMENT_ALREADY_PUBLISHED";
    TournamentsErrorCode["TOURNAMENT_CANNOT_CANCEL"] = "TOURNAMENT_CANNOT_CANCEL";
    TournamentsErrorCode["PUBLISH_MISSING_FIELDS"] = "PUBLISH_MISSING_FIELDS";
    TournamentsErrorCode["INVALID_COORDINATES"] = "INVALID_COORDINATES";
    TournamentsErrorCode["CANNOT_CHANGE_CORE_FIELDS"] = "CANNOT_CHANGE_CORE_FIELDS";
    TournamentsErrorCode["FACILITY_NOT_FOUND"] = "FACILITY_NOT_FOUND";
    TournamentsErrorCode["SPONSOR_NOT_FOUND"] = "SPONSOR_NOT_FOUND";
    TournamentsErrorCode["CIRCUIT_REQUIRES_STAGES"] = "CIRCUIT_REQUIRES_STAGES";
    TournamentsErrorCode["STAGE_DATE_TOO_SOON"] = "STAGE_DATE_TOO_SOON";
    TournamentsErrorCode["STAGE_NOT_FOUND"] = "STAGE_NOT_FOUND";
    TournamentsErrorCode["TOURNAMENT_TOO_CLOSE_TO_EDIT"] = "TOURNAMENT_TOO_CLOSE_TO_EDIT";
})(TournamentsErrorCode || (exports.TournamentsErrorCode = TournamentsErrorCode = {}));
exports.TournamentsErrorMessages = {
    [TournamentsErrorCode.TOURNAMENT_NOT_FOUND]: 'Tournament not found',
    [TournamentsErrorCode.NOT_TOURNAMENT_OWNER]: 'Only the tournament owner can perform this action',
    [TournamentsErrorCode.TOURNAMENT_NOT_DRAFT]: 'This action is only allowed for draft tournaments',
    [TournamentsErrorCode.TOURNAMENT_ALREADY_PUBLISHED]: 'Tournament is already published',
    [TournamentsErrorCode.TOURNAMENT_CANNOT_CANCEL]: 'Cannot cancel a tournament that has already started',
    [TournamentsErrorCode.PUBLISH_MISSING_FIELDS]: 'Missing required fields to publish',
    [TournamentsErrorCode.INVALID_COORDINATES]: 'Invalid latitude/longitude values',
    [TournamentsErrorCode.CANNOT_CHANGE_CORE_FIELDS]: 'Cannot change type or format after publishing',
    [TournamentsErrorCode.FACILITY_NOT_FOUND]: 'Facility not found in this tournament',
    [TournamentsErrorCode.SPONSOR_NOT_FOUND]: 'Sponsor not found in this tournament',
    [TournamentsErrorCode.CIRCUIT_REQUIRES_STAGES]: 'Circuit tournaments require at least one stage',
    [TournamentsErrorCode.STAGE_DATE_TOO_SOON]: 'Stage dates must be at least 1 week in the future',
    [TournamentsErrorCode.STAGE_NOT_FOUND]: 'Stage not found in this tournament',
    [TournamentsErrorCode.TOURNAMENT_TOO_CLOSE_TO_EDIT]: 'Cannot edit: tournament date is less than 3 days away',
};
//# sourceMappingURL=tournaments-error.enum.js.map