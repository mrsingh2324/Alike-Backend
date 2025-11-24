"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwilioClient = void 0;
const twilio_1 = __importDefault(require("twilio"));
const env_1 = require("./env");
let client = null;
const getTwilioClient = () => {
    if (!env_1.env.TWILIO_ACCOUNT_SID || !env_1.env.TWILIO_AUTH_TOKEN) {
        return null;
    }
    if (!client) {
        client = (0, twilio_1.default)(env_1.env.TWILIO_ACCOUNT_SID, env_1.env.TWILIO_AUTH_TOKEN);
    }
    return client;
};
exports.getTwilioClient = getTwilioClient;
//# sourceMappingURL=twilio.js.map