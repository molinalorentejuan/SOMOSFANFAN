import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { ApiError } from './middleware/errorHandler';

const JWT_SECRET: string = process.env.JWT_SECRET || 'secretito-cambiar-en-produccion';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Hash de la contraseña admin (se genera al iniciar si no existe)
let adminPasswordHash: string | null = null;

// Inicializar hash de contraseña admin
export async function initAdminPassword() {
    if (!adminPasswordHash) {
        adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
        console.log(`✅ Admin configurado: ${ADMIN_USERNAME}`);
    }
}

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function authMiddleware(req: Request & { user?: any }, res: Response, next: NextFunction) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return next(new ApiError(401, 'Falta token'));
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        next();
    } catch {
        return next(new ApiError(401, 'Token inválido o expirado'));
    }
}

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
    await initAdminPassword();
    
    if (username !== ADMIN_USERNAME) {
        return false;
    }
    
    if (!adminPasswordHash) {
        return false;
    }
    
    return await bcrypt.compare(password, adminPasswordHash);
}
