import twilio from "twilio";
import { env } from "./env";
let client = null;
export const getTwilioClient = () => {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
        return null;
    }
    if (!client) {
        client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    }
    return client;
};
//# sourceMappingURL=twilio.js.map