import { Router, NextFunction, Request, Response } from 'express';
import { signToken, verifyAdmin, initAdminPassword } from '../auth';
import { validate } from "../middleware/validate";
import { loginSchema } from "../validators";
import { ApiError } from "../middleware/errorHandler";

export const authRouter = Router();

// Inicializar contraseña admin al iniciar
initAdminPassword();

// Login admin
authRouter.post(
    '/auth/login',
    validate(loginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body || {};
            if (!email || !password) {
                return next(new ApiError(400, 'Usuario y contraseña requeridos'));
            }

            // Usar email como username para compatibilidad
            const isValid = await verifyAdmin(email, password);
            if (!isValid) {
                return next(new ApiError(401, 'Credenciales inválidas'));
            }

            const token = signToken({ 
                username: email, 
                email: email,
                role: 'admin' 
            });

            res.json({
                token,
                user: { username: email, email: email, role: 'admin' }
            });
        } catch (e: any) {
            return next(e);
        }
    }
);
