"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendliesErrorMessages = exports.FriendliesErrorCode = void 0;
var FriendliesErrorCode;
(function (FriendliesErrorCode) {
    FriendliesErrorCode["FRIENDLY_NOT_FOUND"] = "FRIENDLY_NOT_FOUND";
    FriendliesErrorCode["NOT_FRIENDLY_REQUESTER"] = "NOT_FRIENDLY_REQUESTER";
    FriendliesErrorCode["NOT_FRIENDLY_CHALLENGED"] = "NOT_FRIENDLY_CHALLENGED";
    FriendliesErrorCode["FRIENDLY_ALREADY_RESPONDED"] = "FRIENDLY_ALREADY_RESPONDED";
    FriendliesErrorCode["FRIENDLY_ALREADY_CANCELLED"] = "FRIENDLY_ALREADY_CANCELLED";
    FriendliesErrorCode["CANNOT_ACCEPT_OWN_FRIENDLY"] = "CANNOT_ACCEPT_OWN_FRIENDLY";
    FriendliesErrorCode["MISSING_CHALLENGED_TARGET"] = "MISSING_CHALLENGED_TARGET";
    FriendliesErrorCode["NOTIFICATION_NOT_FOUND"] = "NOTIFICATION_NOT_FOUND";
    FriendliesErrorCode["FRIENDLY_NOT_ACCEPTED"] = "FRIENDLY_NOT_ACCEPTED";
    FriendliesErrorCode["NOT_CHALLENGED_TEAM_OWNER"] = "NOT_CHALLENGED_TEAM_OWNER";
    FriendliesErrorCode["INVALID_ATHLETE_COUNT"] = "INVALID_ATHLETE_COUNT";
    FriendliesErrorCode["ATHLETE_NOT_IN_TEAM"] = "ATHLETE_NOT_IN_TEAM";
    FriendliesErrorCode["INVALID_REFEREE_CODE"] = "INVALID_REFEREE_CODE";
    FriendliesErrorCode["NOT_FRIENDLY_PARTICIPANT"] = "NOT_FRIENDLY_PARTICIPANT";
    FriendliesErrorCode["CANNOT_START_MATCH_OUTSIDE_DAY"] = "CANNOT_START_MATCH_OUTSIDE_DAY";
    FriendliesErrorCode["CANNOT_START_MATCH_BEFORE_TIME"] = "CANNOT_START_MATCH_BEFORE_TIME";
})(FriendliesErrorCode || (exports.FriendliesErrorCode = FriendliesErrorCode = {}));
exports.FriendliesErrorMessages = {
    [FriendliesErrorCode.FRIENDLY_NOT_FOUND]: 'Friendly match not found',
    [FriendliesErrorCode.NOT_FRIENDLY_REQUESTER]: 'Only the requester can perform this action',
    [FriendliesErrorCode.NOT_FRIENDLY_CHALLENGED]: 'Only the challenged user/team can perform this action',
    [FriendliesErrorCode.FRIENDLY_ALREADY_RESPONDED]: 'This friendly match has already been responded to',
    [FriendliesErrorCode.FRIENDLY_ALREADY_CANCELLED]: 'This friendly match has already been cancelled',
    [FriendliesErrorCode.CANNOT_ACCEPT_OWN_FRIENDLY]: 'You cannot accept your own friendly match request',
    [FriendliesErrorCode.MISSING_CHALLENGED_TARGET]: 'Must specify at least one target (challengedId or challengedTeamId)',
    [FriendliesErrorCode.NOTIFICATION_NOT_FOUND]: 'Notification not found',
    [FriendliesErrorCode.FRIENDLY_NOT_ACCEPTED]: 'Friendly match must be accepted to perform this action',
    [FriendliesErrorCode.NOT_CHALLENGED_TEAM_OWNER]: 'Only the challenged team owner can perform this action',
    [FriendliesErrorCode.INVALID_ATHLETE_COUNT]: 'Invalid number of athletes for the selected category format',
    [FriendliesErrorCode.ATHLETE_NOT_IN_TEAM]: 'One or more athletes are not members of the specified team',
    [FriendliesErrorCode.INVALID_REFEREE_CODE]: 'Invalid or expired referee code',
    [FriendliesErrorCode.NOT_FRIENDLY_PARTICIPANT]: 'Only a participant of this friendly match can perform this action',
    [FriendliesErrorCode.CANNOT_START_MATCH_OUTSIDE_DAY]: 'Partidas amistosas só podem ser iniciadas no dia agendado',
    [FriendliesErrorCode.CANNOT_START_MATCH_BEFORE_TIME]: 'A partida só pode ser iniciada a partir do horário agendado',
};
//# sourceMappingURL=friendlies-error.enum.js.map