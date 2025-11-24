"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = require("./loaders/express");
const database_1 = require("./config/database");
const sockets_1 = require("./sockets");
const logger_1 = require("./config/logger");
const bootstrap = async () => {
    await (0, database_1.connectDatabase)();
    const app = (0, express_1.createExpressApp)();
    const server = http_1.default.createServer(app);
    (0, sockets_1.initSocketServer)(server);
    server.listen(5005, () => {
        logger_1.logger.info(`Server listening on port 5005`);
    });
};
bootstrap().catch((error) => {
    logger_1.logger.error({ error }, "Failed to bootstrap server");
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    logger_1.logger.error({ reason }, "Unhandled Promise rejection");
});
process.on("uncaughtException", (error) => {
    logger_1.logger.error({ error }, "Uncaught Exception");
    process.exit(1);
});
//# sourceMappingURL=index.js.map