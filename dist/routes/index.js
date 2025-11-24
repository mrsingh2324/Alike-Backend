"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const chat_routes_1 = __importDefault(require("./chat.routes"));
const message_routes_1 = __importDefault(require("./message.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/user", user_routes_1.default);
router.use("/contacts", contact_routes_1.default);
router.use("/chats", chat_routes_1.default);
router.use("/chats/:chatId/messages", message_routes_1.default);
router.use("/notifications", notification_routes_1.default);
router.use("/upload", upload_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map