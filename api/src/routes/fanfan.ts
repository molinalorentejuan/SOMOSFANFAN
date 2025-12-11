import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { leadSchema } from '../validators';
import { authMiddleware } from '../auth';
import { ApiError } from '../middleware/errorHandler';
import { pool, db } from '../db';

export const fanfanRouter = Router();

// Crear lead (público, no requiere autenticación)
fanfanRouter.post('/fanfan/leads', validate(leadSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body || {};
            
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

            res.status(201).json({ 
                success: true, 
                message: 'Lead guardado correctamente',
                lead: newLead 
            });
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudo guardar el lead'));
        }
    }
);

// Obtener todos los leads (requiere autenticación admin)
fanfanRouter.get('/fanfan/leads', authMiddleware,
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
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

            res.json({ 
                success: true,
                leads: leads,
                total: leads.length 
            });
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudieron obtener los leads'));
        }
    }
);
