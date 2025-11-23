import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env, isProduction } from "./env";
import { logger } from "./logger";

let memoryServer: MongoMemoryServer | null = null;

const cleanup = async () => {
  await mongoose.connection.close().catch((error) => logger.error({ error }, "Error closing Mongo connection"));
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

export const connectDatabase = async (): Promise<void> => {
  try {
    let mongoUri = env.MONGO_URI;

    if (mongoUri === "memory") {
      memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
      logger.warn("Using in-memory MongoDB instance (mongodb-memory-server)");
    }

    await mongoose.connect(mongoUri, {
      autoIndex: !isProduction
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error({ error }, "Failed to connect to MongoDB");
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await cleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await cleanup();
  process.exit(0);
});
