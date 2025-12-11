import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators';
import { signToken, verifyAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        // Validar datos
        const validated = loginSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                { error: validated.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password } = validated.data;

        // Verificar credenciales
        const isValid = await verifyAdmin(email, password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Generar token
        const token = signToken({ 
            username: email, 
            email: email,
            role: 'admin' 
        });

        return NextResponse.json({
            token,
            user: { username: email, email: email, role: 'admin' }
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'Error en el servidor' },
            { status: 500 }
        );
    }
}

