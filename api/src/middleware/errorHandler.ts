import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    const status =
        err instanceof ApiError ? err.status : typeof err?.status === "number"
            ? err.status
                : 500;

    let message: string;
    if (err instanceof ApiError) {
        message = err.message;
    } else if (err instanceof Error) {
        message = err.message;
    } else if (typeof err === "string") {
        message = err;
    } else {
        try {
            message = JSON.stringify(err);
        } catch {
            message = String(err);
        }
    }

    res.status(status).json({
        success: false,
        error: { status, message },
    });
}