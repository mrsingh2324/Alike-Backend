import http from "http";
import { createExpressApp } from "./loaders/express";
import { connectDatabase } from "./config/database";
import { initSocketServer } from "./sockets";
import { logger } from "./config/logger";
const bootstrap = async () => {
    await connectDatabase();
    const app = createExpressApp();
    const server = http.createServer(app);
    initSocketServer(server);
    server.listen(5005, () => {
        logger.info(`Server listening on port 5005`);
    });
};
bootstrap().catch((error) => {
    logger.error({ error }, "Failed to bootstrap server");
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled Promise rejection");
});
process.on("uncaughtException", (error) => {
    logger.error({ error }, "Uncaught Exception");
    process.exit(1);
});
//# sourceMappingURL=index.js.map