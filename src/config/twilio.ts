import twilio, { type Twilio } from "twilio";
import { env } from "./env";

let client: Twilio | null = null;

export const getTwilioClient = (): Twilio | null => {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
    return null;
  }

  if (!client) {
    client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }

  return client;
};
