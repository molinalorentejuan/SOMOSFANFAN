import 'dotenv/config';
import { createApp } from './app';
import { initDb, closeDb } from './db';

const app = createApp();
const PORT = Number(process.env.PORT || 8080);

// Inicializar base de datos
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ API escuchando en http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
});

// Cerrar conexión al terminar
process.on('SIGINT', async () => {
    await closeDb();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeDb();
    process.exit(0);
});