import createHttpError from "http-errors";
import { verifyAccessToken } from "../utils/jwt";
import { UserModel } from "../models/User";
export const authMiddleware = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next(createHttpError(401, "Authorization header missing"));
    }
    try {
        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(createHttpError(401, "Token missing"));
        }
        const payload = verifyAccessToken(token);
        const user = await UserModel.findById(payload.sub);
        if (!user) {
            return next(createHttpError(401, "User not found"));
        }
        req.userId = user.id;
        req.authUser = user;
        return next();
    }
    catch (error) {
        return next(createHttpError(401, error.message));
    }
};
