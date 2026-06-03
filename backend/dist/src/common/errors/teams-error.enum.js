"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsErrorMessages = exports.TeamsErrorCode = void 0;
var TeamsErrorCode;
(function (TeamsErrorCode) {
    TeamsErrorCode["TEAM_NOT_FOUND"] = "TEAM_NOT_FOUND";
    TeamsErrorCode["NOT_TEAM_OWNER"] = "NOT_TEAM_OWNER";
    TeamsErrorCode["MEMBER_NOT_FOUND"] = "MEMBER_NOT_FOUND";
    TeamsErrorCode["MEMBER_ALREADY_IN_TEAM"] = "MEMBER_ALREADY_IN_TEAM";
    TeamsErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND_BY_EMAIL";
    TeamsErrorCode["CANNOT_REMOVE_OWNER"] = "CANNOT_REMOVE_OWNER";
    TeamsErrorCode["GUEST_NAME_REQUIRED"] = "GUEST_NAME_REQUIRED";
    TeamsErrorCode["CPF_ALREADY_IN_TEAM"] = "CPF_ALREADY_IN_TEAM";
    TeamsErrorCode["INVALID_CPF"] = "INVALID_CPF";
    TeamsErrorCode["INVITATION_NOT_FOUND"] = "INVITATION_NOT_FOUND";
    TeamsErrorCode["INVITATION_ALREADY_PENDING"] = "INVITATION_ALREADY_PENDING";
    TeamsErrorCode["INVITATION_ALREADY_RESPONDED"] = "INVITATION_ALREADY_RESPONDED";
    TeamsErrorCode["NOT_INVITED_USER"] = "NOT_INVITED_USER";
    TeamsErrorCode["USER_ALREADY_TEAM_MEMBER"] = "USER_ALREADY_TEAM_MEMBER";
    TeamsErrorCode["INVALID_FILE_TYPE"] = "INVALID_FILE_TYPE";
    TeamsErrorCode["FILE_TOO_LARGE"] = "FILE_TOO_LARGE";
})(TeamsErrorCode || (exports.TeamsErrorCode = TeamsErrorCode = {}));
exports.TeamsErrorMessages = {
    [TeamsErrorCode.TEAM_NOT_FOUND]: 'Team not found',
    [TeamsErrorCode.NOT_TEAM_OWNER]: 'Only the team owner can perform this action',
    [TeamsErrorCode.MEMBER_NOT_FOUND]: 'Member not found in this team',
    [TeamsErrorCode.MEMBER_ALREADY_IN_TEAM]: 'This user is already a member of this team',
    [TeamsErrorCode.USER_NOT_FOUND]: 'No user found with this email',
    [TeamsErrorCode.CANNOT_REMOVE_OWNER]: 'Cannot remove the team owner',
    [TeamsErrorCode.GUEST_NAME_REQUIRED]: 'Guest name is required for guest members',
    [TeamsErrorCode.CPF_ALREADY_IN_TEAM]: 'This CPF is already registered in this team',
    [TeamsErrorCode.INVALID_CPF]: 'Invalid CPF',
    [TeamsErrorCode.INVITATION_NOT_FOUND]: 'Invitation not found',
    [TeamsErrorCode.INVITATION_ALREADY_PENDING]: 'An invitation is already pending for this user in this team',
    [TeamsErrorCode.INVITATION_ALREADY_RESPONDED]: 'This invitation has already been responded to',
    [TeamsErrorCode.NOT_INVITED_USER]: 'Only the invited user can perform this action',
    [TeamsErrorCode.USER_ALREADY_TEAM_MEMBER]: 'This user is already a member of this team',
    [TeamsErrorCode.INVALID_FILE_TYPE]: 'Invalid file type. Allowed: JPEG, PNG, WebP',
    [TeamsErrorCode.FILE_TOO_LARGE]: 'File too large. Maximum size: 5MB',
};
//# sourceMappingURL=teams-error.enum.js.map