import jwt, { type JwtPayload as DefaultJwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload extends DefaultJwtPayload {
  sub: string;
}

const signOptions: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
};

export const signAccessToken = (userId: string): string => {
  const payload: AccessTokenPayload = { sub: userId };
  return jwt.sign(payload, env.JWT_SECRET, signOptions);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
};
