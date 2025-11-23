import createHttpError from "http-errors";
import { logger } from "../config/logger";
export const errorHandler = (err, _req, res, _next) => {
    const error = createHttpError.isHttpError(err)
        ? err
        : createHttpError(500, err?.message || "Internal Server Error");
    if (error.status >= 500) {
        logger.error({ err }, "Unhandled server error");
    }
    return res.status(error.status).json({
        success: false,
        message: error.message
    });
};
//# sourceMappingURL=errorHandler.js.map