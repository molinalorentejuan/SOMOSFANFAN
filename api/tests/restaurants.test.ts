import request from 'supertest';
import { createApp } from '../src/app';
import { resetDb } from '../src/data';

async function registerAndLogin(app: any) {
    const email = `user${Math.random().toString(36).slice(2, 8)}@test.com`;
    const password = 'pass123';
    const username = 'user_' + Math.random().toString(36).slice(2, 6);
    const reg = await request(app)
        .post('/auth/register')
        .send({ username, password, email });
    return { token: reg.body.token, user: reg.body.user };
}

describe('Restaurants', () => {
    const app = createApp();
    beforeEach(() => resetDb());

    it('lists restaurants with avgRating/commentCount', async () => {
        const res = await request(app).get('/restaurants');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length) {
            const r = res.body[0];
            expect(r).toHaveProperty('avgRating');
            expect(r).toHaveProperty('commentCount');
        }
    });

    it('creates and deletes restaurant as owner', async () => {
        const { token, user } = await registerAndLogin(app);

        const createRes = await request(app)
            .post('/restaurants')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Mi sitio',
                cuisine: 'De barrio de Vallecas',
                address: 'Calle 1123',
                phone: '123',
                image: 'https://example.com/img.jpg',
                openingHours: '10-22',
                description: 'rico',
                lat: 40.4,
                lng: -3.7,
            });

        expect(createRes.status).toBe(201);
        expect(createRes.body).toHaveProperty('id');
        expect(createRes.body).toHaveProperty('ownerId', user.id);

        const del = await request(app)
            .delete(`/restaurants/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(del.status).toBe(200);
        expect(del.body).toMatchObject({ ok: true });
    });

    it('creates comment', async () => {
        const { token, user } = await registerAndLogin(app);

        // Creamos un restaurante primero (solo name + address obligatorios)
        const rest = await request(app)
            .post('/restaurants')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Rest test',
                address: 'Av Test31312312',
            });

        expect(rest.status).toBe(201);
        const restaurantId = rest.body.id;

        const text = 'Test comment ' + Date.now();
        const create = await request(app)
            .post(`/restaurants/${restaurantId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text, rating: 4 });

        expect(create.status).toBe(201);
        expect(create.body.created).toHaveProperty('id');
        expect(create.body.created).toMatchObject({
            text,
            userId: user.id,
            restaurantId,
        });
        expect(Array.isArray(create.body.comments)).toBe(true);
        expect(create.body.comments.some((c: any) => c.text === text)).toBe(true);
    });

    it('rejects create without auth', async () => {
        const res = await request(app).post('/restaurants').send({
            name: 'X tiempo',
            address: 'Mercado de Tiempo',
        });
        expect(res.status).toBe(401);
    });
});