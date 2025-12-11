import request from 'supertest';
import { createApp } from '../src/app';
import { resetDb } from '../src/data';

describe('Auth (register/login)', () => {
    const app = createApp();

    beforeEach(() => resetDb());

    it('registers a new user and returns token + user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'juan', password: '123456', email: 'juan@example.com' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toMatchObject({ username: 'juan', email: 'juan@example.com' });
    });

    it('prevents duplicate emails', async () => {
        await request(app)
            .post('/auth/register')
            .send({ username: 'ana', password: '123456', email: 'ana@example.com' })
            .expect(201);

        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'ana2', password: 'abcdef', email: 'ana@example.com' });

        expect(res.status).toBe(400); // Zod/servidor devuelve 400
        expect(res.body).toHaveProperty('error');
    });

    it('logins with valid credentials', async () => {
        await request(app)
            .post('/auth/register')
            .send({ username: 'pepe', password: '123456', email: 'pepe@example.com' })
            .expect(201);

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'pepe@example.com', password: '123456' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toMatchObject({ username: 'pepe', email: 'pepe@example.com' });
    });

    it('rejects invalid login (bad credentials)', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'nobody@example.com', password: 'wrong' });

        // Ahora con Zod/lógica → 400
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });
});