import type { IMessage } from "../models/Message";
import { DeviceTokenModel } from "../models/DeviceToken";
import { getFirebaseApp } from "../config/firebase";
import { logger } from "../config/logger";
enum PlatformType {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

export const registerDeviceToken = async (userId: string, token: string, platform: PlatformType) => {
  await DeviceTokenModel.updateOne(
    { token },
    { userId, token, platform },
    { upsert: true }
  );
};

export const unregisterDeviceToken = async (token: string) => {
  await DeviceTokenModel.deleteOne({ token });
};

export const sendMessageNotification = async (
  recipientIds: string[],
  message: IMessage,
  senderName: string
) => {
  const app = getFirebaseApp();
  if (!app) {
    logger.warn("FCM not configured; skipping push notification");
    return;
  }

  const tokens = await DeviceTokenModel.find({ userId: { $in: recipientIds } }, { token: 1 }).lean();
  if (!tokens.length) return;

  const messaging = app.messaging();
  const payload = {
    notification: {
      title: senderName,
      body: message.text.length > 120 ? `${message.text.slice(0, 117)}...` : message.text
    },
    data: {
      chatId: (message.chatId as any).toString(),
      messageId: ((message as any)._id || (message as any).id).toString()
    }
  };

  const chunks = Array.from({ length: Math.ceil(tokens.length / 500) }, (_v, i) =>
    tokens.slice(i * 500, i * 500 + 500)
  );

  await Promise.all(
    chunks.map((chunk) =>
      messaging
        .sendMulticast({ ...payload, tokens: chunk.map((c) => c.token) })
        .catch((error) => logger.error({ error }, "FCM send failed"))
    )
  );
};
