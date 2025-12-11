import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { restaurantRouter } from './routes/restaurants';
import { commentRouter } from './routes/comments';
import {errorHandler} from "./middleware/errorHandler";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    app.use(authRouter);
    app.use(restaurantRouter);
    app.use(commentRouter);

    app.use(errorHandler);

    return app;
}