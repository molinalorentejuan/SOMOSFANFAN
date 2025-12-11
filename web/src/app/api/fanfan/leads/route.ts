import { NextRequest, NextResponse } from 'next/server';
import { leadSchema } from '@/lib/validators';
import { verifyToken } from '@/lib/auth';
import { pool, db } from '@/lib/db';

// POST - Crear lead (público)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        // Validar datos
        const validated = leadSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                { error: validated.error.errors[0].message },
                { status: 400 }
            );
        }

        const data = validated.data;
        
        const newLead = {
            id: data.id || `FF-${Date.now()}`,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono || '',
            mensaje: data.mensaje || '',
            tipo: data.tipo,
            codigo: data.codigo || null,
            descuento: data.descuento || null,
            fecha: data.fecha || new Date().toISOString(),
        };

        // Guardar en PostgreSQL si está disponible, sino en memoria
        if (pool) {
            await pool.query(
                `INSERT INTO leads (id, nombre, email, telefono, mensaje, tipo, codigo, descuento, fecha)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    newLead.id,
                    newLead.nombre,
                    newLead.email,
                    newLead.telefono,
                    newLead.mensaje,
                    newLead.tipo,
                    newLead.codigo,
                    newLead.descuento,
                    newLead.fecha
                ]
            );
        } else {
            // Fallback: memoria
            db.leads.push(newLead);
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Lead guardado correctamente',
            lead: newLead 
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'No se pudo guardar el lead' },
            { status: 500 }
        );
    }
}

// GET - Obtener todos los leads (requiere autenticación admin)
export async function GET(req: NextRequest) {
    try {
        // Verificar autenticación
        const auth = req.headers.get('authorization') || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
        
        if (!token) {
            return NextResponse.json(
                { error: 'Falta token de autenticación' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json(
                { error: 'Token inválido o expirado' },
                { status: 401 }
            );
        }

        // Obtener leads
        let leads: any[] = [];

        if (pool) {
            // Desde PostgreSQL
            const result = await pool.query(
                'SELECT * FROM leads ORDER BY fecha DESC'
            );
            leads = Array.isArray(result.rows) ? result.rows : [];
        } else {
            // Fallback: memoria
            leads = Array.isArray(db.leads) ? db.leads : [];
        }

        return NextResponse.json({ 
            success: true,
            leads: leads,
            total: leads.length 
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'No se pudieron obtener los leads' },
            { status: 500 }
        );
    }
}

