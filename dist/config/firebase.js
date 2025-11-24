"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseApp = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const env_1 = require("./env");
let initialized = false;
const getFirebaseApp = () => {
    if (!env_1.env.FCM_PROJECT_ID || !env_1.env.FCM_CLIENT_EMAIL || !env_1.env.FCM_PRIVATE_KEY) {
        return null;
    }
    if (!initialized) {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: env_1.env.FCM_PROJECT_ID,
                clientEmail: env_1.env.FCM_CLIENT_EMAIL,
                privateKey: env_1.env.FCM_PRIVATE_KEY.replace(/\\n/g, "\n")
            })
        });
        initialized = true;
    }
    return firebase_admin_1.default.app();
};
exports.getFirebaseApp = getFirebaseApp;
//# sourceMappingURL=firebase.js.map