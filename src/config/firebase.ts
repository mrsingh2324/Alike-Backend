import admin from "firebase-admin";
import { env } from "./env";

let initialized = false;

export const getFirebaseApp = (): admin.app.App | null => {
  if (!env.FCM_PROJECT_ID || !env.FCM_CLIENT_EMAIL || !env.FCM_PRIVATE_KEY) {
    return null;
  }

  if (!initialized) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FCM_PROJECT_ID,
        clientEmail: env.FCM_CLIENT_EMAIL,
        privateKey: env.FCM_PRIVATE_KEY.replace(/\\n/g, "\n")
      })
    });
    initialized = true;
  }

  return admin.app();
};
