import jwt from "jsonwebtoken";
import { env } from "../config/env";
const signOptions = {
    expiresIn: env.JWT_EXPIRES_IN
};
export const signAccessToken = (userId) => {
    const payload = { sub: userId };
    return jwt.sign(payload, env.JWT_SECRET, signOptions);
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};
