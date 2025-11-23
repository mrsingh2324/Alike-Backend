import type { AnyZodObject } from "zod";
import type { RequestHandler } from "express";
import createHttpError from "http-errors";

export const validateRequest = (schema: AnyZodObject): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });

    if (!result.success) {
      const message = result.error.errors[0]?.message ?? "Validation error";
      return next(createHttpError(422, message));
    }

    Object.assign(req, result.data);
    return next();
  };
};
