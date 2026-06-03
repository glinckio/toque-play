"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BracketsErrorMessages = exports.BracketsErrorCode = void 0;
var BracketsErrorCode;
(function (BracketsErrorCode) {
    BracketsErrorCode["BRACKET_NOT_FOUND"] = "BRACKET_NOT_FOUND";
    BracketsErrorCode["BRACKET_ALREADY_GENERATED"] = "BRACKET_ALREADY_GENERATED";
    BracketsErrorCode["BRACKET_TOO_EARLY"] = "BRACKET_TOO_EARLY";
    BracketsErrorCode["NO_CONFIRMED_TEAMS"] = "NO_CONFIRMED_TEAMS";
    BracketsErrorCode["INVALID_BRACKET_TYPE"] = "INVALID_BRACKET_TYPE";
    BracketsErrorCode["TOURNAMENT_NOT_READY"] = "TOURNAMENT_NOT_READY";
    BracketsErrorCode["INVALID_TEAM_COUNT"] = "INVALID_TEAM_COUNT";
})(BracketsErrorCode || (exports.BracketsErrorCode = BracketsErrorCode = {}));
exports.BracketsErrorMessages = {
    [BracketsErrorCode.BRACKET_NOT_FOUND]: 'Bracket not found',
    [BracketsErrorCode.BRACKET_ALREADY_GENERATED]: 'Bracket already generated for this category',
    [BracketsErrorCode.BRACKET_TOO_EARLY]: 'Bracket can only be generated at most 2 days before the tournament date',
    [BracketsErrorCode.NO_CONFIRMED_TEAMS]: 'No confirmed teams to generate bracket',
    [BracketsErrorCode.INVALID_BRACKET_TYPE]: 'Invalid bracket type',
    [BracketsErrorCode.TOURNAMENT_NOT_READY]: 'Tournament is not ready for bracket generation',
    [BracketsErrorCode.INVALID_TEAM_COUNT]: 'Not enough teams to generate bracket (minimum 2)',
};
//# sourceMappingURL=brackets-error.enum.js.map