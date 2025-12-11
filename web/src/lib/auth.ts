import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
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

// Inicializar al cargar el módulo
initAdminPassword();

