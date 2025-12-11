import request from 'supertest';
import { createApp } from '../src/app';
import { resetDb } from '../src/data';

async function registerAndLogin(app: any) {
    const email = `user${Math.random().toString(36).slice(2, 8)}@test.com`;
    const password = 'secret123';
    const username = 'user_' + Math.random().toString(36).slice(2, 6);
    const reg = await request(app)
        .post('/auth/register')
        .send({ username, password, email });
    return { token: reg.body.token, user: reg.body.user };
}

describe('Comments CRUD', () => {
    const app = createApp();
    beforeEach(() => resetDb());

    it('creates, lists and deletes own comment', async () => {
        const { token, user } = await registerAndLogin(app);

        // 1. Crear un restaurante antes de comentar
        const rest = await request(app)
            .post('/restaurants')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Rest test',
                address: 'Calle test 123',
                description: 'AMIGO',
            });

        expect(rest.status).toBe(201);
        const restaurantId = rest.body.id;
        expect(restaurantId).toBeTruthy();

        // 2. Crear comentario
        const text = 'Maravilloso!';
        const created = await request(app)
            .post(`/restaurants/${restaurantId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text, rating: 5 });

        expect(created.status).toBe(201);
        expect(created.body.created).toHaveProperty('id');
        expect(created.body.created).toMatchObject({
            text,
            userId: user.id,
            restaurantId,
        });

        // 3. Listar comentarios
        const get = await request(app).get(`/restaurants/${restaurantId}/comments`);
        expect(get.status).toBe(200);
        expect(get.body.some((c: any) => c.text === text)).toBe(true);

        // 4. Borrar comentario
        const del = await request(app)
            .delete(`/comments/${created.body.created.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(del.status).toBe(204);
    });
});