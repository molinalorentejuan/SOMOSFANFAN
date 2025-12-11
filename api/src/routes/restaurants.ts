import { Router, Request, Response, NextFunction } from 'express';
import { db, Restaurant, nextId } from '../data';
import { authMiddleware } from '../auth';
import { validate } from "../middleware/validate";
import { restaurantSchema } from "../validators";
import { ApiError } from "../middleware/errorHandler";

export const restaurantRouter = Router();

// Lista con media y número de comentarios
restaurantRouter.get('/restaurants', (_req: Request, res: Response) => {
    const list = db.restaurants.map(r => {
        const rated = db.comments.filter(c => c.restaurantId === r.id && typeof c.rating === 'number');
        const avgRating = rated.length
            ? Math.round((rated.reduce((s, c) => s + (c.rating || 0), 0) / rated.length) * 10) / 10
            : null;
        const commentCount = db.comments.filter(c => c.restaurantId === r.id).length;
        return { ...r, avgRating, commentCount };
    });
    res.json(list);
});

// Detalle con media del restaurante
restaurantRouter.get('/restaurants/:id',
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const r = db.restaurants.find(x => x.id === id);
            if (!r) return next(new ApiError(404, 'Restaurante no encontrado'));

            const rated = db.comments.filter(c => c.restaurantId === id && typeof c.rating === 'number');
            const avgRating = rated.length
                ? Math.round((rated.reduce((s, c) => s + (c.rating || 0), 0) / rated.length) * 10) / 10
                : null;
            const commentCount = db.comments.filter(c => c.restaurantId === id).length;

            res.json({ ...r, avgRating, commentCount });
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudo obtener el restaurante'));
        }
    }
);

// Crear (asigna ownerId)
restaurantRouter.post('/restaurants', validate(restaurantSchema), authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const p = req.body || {};
            const newR: Restaurant = {
                id: nextId('restaurant'),
                ownerId: user.id,
                name: p.name,
                cuisine: p.cuisine || '',
                address: p.address || '',
                phone: p.phone || '',
                image: p.image || '',
                openingHours: p.openingHours || '',
                description: p.description || '',
                lat: typeof p.lat === 'number' ? p.lat : 40.4168,
                lng: typeof p.lng === 'number' ? p.lng : -3.7038,
            };
            db.restaurants.push(newR);
            res.status(201).json(newR);
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudo crear restaurante'));
        }
    }
);

// Editar (solo creador)
restaurantRouter.put('/restaurants/:id', validate(restaurantSchema), authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const id = Number(req.params.id);
            const idx = db.restaurants.findIndex(r => r.id === id);
            if (idx === -1) return next(new ApiError(404, 'Restaurante no encontrado'));
            const existing = db.restaurants[idx];
            if (existing.ownerId !== user.id) return next(new ApiError(403, 'No autorizado'));

            db.restaurants[idx] = { ...existing, ...req.body, id: existing.id, ownerId: existing.ownerId };
            res.json(db.restaurants[idx]);
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudo editar restaurante'));
        }
    }
);

// Borrar (solo creador)
restaurantRouter.delete('/restaurants/:id', authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const id = Number(req.params.id);
            const existing = db.restaurants.find(r => r.id === id);
            if (!existing) return next(new ApiError(404, 'Restaurante no encontrado'));
            if (existing.ownerId !== user.id) return next(new ApiError(403, 'No autorizado'));

            db.restaurants = db.restaurants.filter(r => r.id !== id);
            res.json({ ok: true });
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudo borrar restaurante'));
        }
    }
);

// Restaurantes creados por un usuario (requiere auth)
restaurantRouter.get('/users/:id/restaurants', authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.params.id);
            if (!Number.isFinite(userId)) return next(new ApiError(400, 'ID inválido'));
            if (req.user?.id !== userId) return next(new ApiError(403, 'Prohibido'));
            const myRestaurants = db.restaurants.filter(r => r.ownerId === userId);
            res.json(myRestaurants);
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudieron listar restaurantes'));
        }
    }
);