export var ChatType;
(function (ChatType) {
    ChatType["SINGLE"] = "single";
    ChatType["GROUP"] = "group";
})(ChatType || (ChatType = {}));
export var MessageStatus;
(function (MessageStatus) {
    MessageStatus["SENT"] = "sent";
    MessageStatus["DELIVERED"] = "delivered";
    MessageStatus["READ"] = "read";
})(MessageStatus || (MessageStatus = {}));
export var OTPChannel;
(function (OTPChannel) {
    OTPChannel["EMAIL"] = "email";
    OTPChannel["PHONE"] = "phone";
})(OTPChannel || (OTPChannel = {}));
export var PlatformType;
(function (PlatformType) {
    PlatformType["WEB"] = "web";
    PlatformType["ANDROID"] = "android";
    PlatformType["IOS"] = "ios";
})(PlatformType || (PlatformType = {}));
export var UserPresenceStatus;
(function (UserPresenceStatus) {
    UserPresenceStatus["ONLINE"] = "online";
    UserPresenceStatus["OFFLINE"] = "offline";
})(UserPresenceStatus || (UserPresenceStatus = {}));
