"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatErrorMessages = exports.ChatErrorCode = void 0;
var ChatErrorCode;
(function (ChatErrorCode) {
    ChatErrorCode["CHAT_NOT_FOUND"] = "CHAT_NOT_FOUND";
    ChatErrorCode["NOT_CHAT_MEMBER"] = "NOT_CHAT_MEMBER";
    ChatErrorCode["INVALID_CHAT_TYPE"] = "INVALID_CHAT_TYPE";
})(ChatErrorCode || (exports.ChatErrorCode = ChatErrorCode = {}));
exports.ChatErrorMessages = {
    [ChatErrorCode.CHAT_NOT_FOUND]: 'Chat not found',
    [ChatErrorCode.NOT_CHAT_MEMBER]: 'You are not a member of this chat',
    [ChatErrorCode.INVALID_CHAT_TYPE]: 'Invalid chat type',
};
//# sourceMappingURL=chat-error.enum.js.map