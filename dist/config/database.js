"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const env_1 = require("./env");
const logger_1 = require("./logger");
let memoryServer = null;
const cleanup = async () => {
    await mongoose_1.default.connection.close().catch((error) => logger_1.logger.error({ error }, "Error closing Mongo connection"));
    if (memoryServer) {
        await memoryServer.stop();
        memoryServer = null;
    }
};
const connectDatabase = async () => {
    try {
        let mongoUri = env_1.env.MONGO_URI;
        if (mongoUri === "memory") {
            memoryServer = await mongodb_memory_server_1.MongoMemoryServer.create();
            mongoUri = memoryServer.getUri();
            logger_1.logger.warn("Using in-memory MongoDB instance (mongodb-memory-server)");
        }
        await mongoose_1.default.connect(mongoUri, {
            autoIndex: !env_1.isProduction
        });
        logger_1.logger.info("Connected to MongoDB");
    }
    catch (error) {
        logger_1.logger.error({ error }, "Failed to connect to MongoDB");
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
});
//# sourceMappingURL=database.js.map