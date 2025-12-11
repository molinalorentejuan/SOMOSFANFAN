import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler"; //

export const validate =
    (schema: AnyZodObject) =>
        (req: Request, _res: Response, next: NextFunction) => {
            try {
                schema.parse(req.body);
                next();
            } catch (err: any) {
                if (err.errors) {
                    const msg = err.errors.map((e: any) => e.message).join(". ");
                    return next(new ApiError(400, msg));
                }
                return next(new ApiError(400, "Datos inválidos"));
            }
        };