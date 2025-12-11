import { Router, NextFunction } from 'express';
import { createUser, signToken, verifyUser } from '../auth';
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators";
import { ApiError } from "../middleware/errorHandler";

export const authRouter = Router();

// Registro
authRouter.post(
    '/auth/register',
    validate(registerSchema),
    async (req, res, next: NextFunction) => {
        try {
            const { username, password, email } = req.body || {};
            if (!username || !password || !email) {
                return next(new ApiError(400, 'Mail, usuario y contraseña requeridos'));
            }

            const u = await createUser(username, password, email);
            const token = signToken({ id: u.id, username: u.username, email: u.email });

            res.status(201).json({
                token,
                user: { id: u.id, username: u.username, email: u.email }
            });
        } catch (e: any) {
            return next(e);
        }
    }
);

// Login
authRouter.post(
    '/auth/login',
    validate(loginSchema),
    async (req, res, next: NextFunction) => {
        try {
            const { email, password } = req.body || {};
            if (!email || !password) {
                return next(new ApiError(400, 'Mail y contraseña requeridos'));
            }

            const u = await verifyUser(email, password);
            if (!u) {
                return next(new ApiError(401, 'Credenciales inválidas'));
            }

            const token = signToken({ id: u.id, username: u.username, email: u.email });

            res.json({
                token,
                user: { id: u.id, username: u.username, email: u.email }
            });
        } catch (e: any) {
            return next(e);
        }
    }
);