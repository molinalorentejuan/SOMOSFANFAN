import { Router, Request, Response, NextFunction } from 'express';
import { db, Comment, nextId } from '../data';
import { authMiddleware } from '../auth';
import { validate } from "../middleware/validate";
import { commentSchema } from "../validators";
import { ApiError } from "../middleware/errorHandler";

export const commentRouter = Router();

// Listar comentarios de un restaurante
commentRouter.get('/restaurants/:id/comments', (req: Request, res: Response) => {
    const restaurantId = Number(req.params.id);
    const list = db.comments.filter(c => c.restaurantId === restaurantId);
    res.json(list);
});

// Crear comentario (guarda rating)
commentRouter.post('/restaurants/:id/comments', validate(commentSchema), authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const restaurantId = Number(req.params.id);
            const rest = db.restaurants.find(r => r.id === restaurantId);
            if (!rest) return next(new ApiError(404, 'Restaurante no encontrado'));

            const { text, rating } = req.body || {};
            if (!text || typeof text !== 'string') {
                return next(new ApiError(400, 'Texto requerido'));
            }
            const parsedRating = typeof rating === 'number'
                ? Math.max(1, Math.min(5, Math.floor(rating)))
                : undefined;

            const newComment: Comment = {
                id: nextId('comment'),
                restaurantId,
                userId: user.id,
                username: user.username,
                text,
                rating: parsedRating,
                createdAt: new Date().toISOString(),
            };
            db.comments.push(newComment);
            const list = db.comments.filter(c => c.restaurantId === restaurantId);
            res.status(201).json({ created: newComment, comments: list });
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudo crear el comentario'));
        }
    }
);

// Editar comentario (solo dueño)
commentRouter.put('/comments/:id', validate(commentSchema), authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const id = Number(req.params.id);
            const idx = db.comments.findIndex(c => c.id === id);
            if (idx === -1) return next(new ApiError(404, 'Comentario no encontrado'));
            if (db.comments[idx].userId !== user.id) return next(new ApiError(403, 'Prohibido'));

            const { text } = req.body || {};
            if (!text) return next(new ApiError(400, 'Texto requerido'));
            db.comments[idx] = { ...db.comments[idx], text };
            res.json(db.comments[idx]);
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudo editar el comentario'));
        }
    }
);

// Borrar comentario (solo dueño)
commentRouter.delete('/comments/:id', authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const id = Number(req.params.id);
            const idx = db.comments.findIndex(c => c.id === id);
            if (idx === -1) return next(new ApiError(404, 'Comentario no encontrado'));
            if (db.comments[idx].userId !== user.id) return next(new ApiError(403, 'Prohibido'));
            db.comments.splice(idx, 1);
            res.status(204).send();
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudo borrar el comentario'));
        }
    }
);

// Comentarios creados por un usuario (requiere auth)
commentRouter.get('/users/:id/comments', authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.params.id);
            if (!Number.isFinite(userId)) return next(new ApiError(400, 'ID inválido'));
            if (req.user?.id !== userId) {
                return next(new ApiError(403, 'Prohibido'));
            }
            const userComments = db.comments.filter(c => c.userId === userId);
            res.json(userComments);
        } catch (e: any) {
            next(new ApiError(500, e?.message || 'No se pudieron listar comentarios'));
        }
    }
);