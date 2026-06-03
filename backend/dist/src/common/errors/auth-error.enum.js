"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorMessages = exports.AuthErrorCode = void 0;
var AuthErrorCode;
(function (AuthErrorCode) {
    AuthErrorCode["EMAIL_ALREADY_EXISTS"] = "EMAIL_ALREADY_EXISTS";
    AuthErrorCode["INVALID_PASSWORD_FORMAT"] = "INVALID_PASSWORD_FORMAT";
    AuthErrorCode["PASSWORDS_DO_NOT_MATCH"] = "PASSWORDS_DO_NOT_MATCH";
    AuthErrorCode["EMAIL_NOT_FOUND"] = "EMAIL_NOT_FOUND";
    AuthErrorCode["INVALID_PASSWORD"] = "INVALID_PASSWORD";
    AuthErrorCode["EMAIL_NOT_VERIFIED"] = "EMAIL_NOT_VERIFIED";
    AuthErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    AuthErrorCode["EMAIL_ALREADY_VERIFIED"] = "EMAIL_ALREADY_VERIFIED";
    AuthErrorCode["INVALID_OR_EXPIRED_CODE"] = "INVALID_OR_EXPIRED_CODE";
    AuthErrorCode["CODE_RESEND_COOLDOWN"] = "CODE_RESEND_COOLDOWN";
    AuthErrorCode["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    AuthErrorCode["INVALID_GOOGLE_TOKEN"] = "INVALID_GOOGLE_TOKEN";
    AuthErrorCode["INVALID_REFRESH_TOKEN"] = "INVALID_REFRESH_TOKEN";
    AuthErrorCode["RESET_TOKEN_INVALID"] = "RESET_TOKEN_INVALID";
    AuthErrorCode["RESET_TOKEN_EXPIRED"] = "RESET_TOKEN_EXPIRED";
})(AuthErrorCode || (exports.AuthErrorCode = AuthErrorCode = {}));
exports.AuthErrorMessages = {
    [AuthErrorCode.EMAIL_ALREADY_EXISTS]: 'This email is already registered',
    [AuthErrorCode.INVALID_PASSWORD_FORMAT]: 'Password must be at least 6 characters long',
    [AuthErrorCode.PASSWORDS_DO_NOT_MATCH]: 'Passwords do not match',
    [AuthErrorCode.EMAIL_NOT_FOUND]: 'No account found with this email',
    [AuthErrorCode.INVALID_PASSWORD]: 'Incorrect password',
    [AuthErrorCode.EMAIL_NOT_VERIFIED]: 'Email not verified. Please verify your email before logging in',
    [AuthErrorCode.USER_NOT_FOUND]: 'User not found',
    [AuthErrorCode.EMAIL_ALREADY_VERIFIED]: 'Email is already verified',
    [AuthErrorCode.INVALID_OR_EXPIRED_CODE]: 'Invalid or expired verification code',
    [AuthErrorCode.CODE_RESEND_COOLDOWN]: 'Please wait 1 minute before requesting a new code',
    [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid credentials',
    [AuthErrorCode.INVALID_GOOGLE_TOKEN]: 'Invalid Google token',
    [AuthErrorCode.INVALID_REFRESH_TOKEN]: 'Invalid or expired refresh token',
    [AuthErrorCode.RESET_TOKEN_INVALID]: 'Invalid reset token',
    [AuthErrorCode.RESET_TOKEN_EXPIRED]: 'Reset token has expired',
};
//# sourceMappingURL=auth-error.enum.js.map