import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { db, User, nextId } from './data';
import { ApiError } from './middleware/errorHandler';

const JWT_SECRET: string = process.env.JWT_SECRET ?? 'secretito';
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET se configura en .env !!)");
}

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
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

export async function createUser(username: string, password: string, email: string): Promise<User> {
    if (db.users.some(u => u.username === username)) {
        throw new ApiError(400, 'Usuario ya existe');
    }
    if (db.users.some(u => u.email === email)) {
        throw new ApiError(400, 'Email ya existe');
    }
    const id = nextId('user');
    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = { id, username, passwordHash, email};
    db.users.push(user);
    return user;
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
    const u = db.users.find(x => x.email === email);
    if (!u) return null;
    const ok = await bcrypt.compare(password, u.passwordHash);
    return ok ? u : null;
}