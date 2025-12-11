// Inicializar DB al arrancar (solo en servidor)
import { initDb } from './db';

// Solo ejecutar en servidor (no en cliente)
if (typeof window === 'undefined') {
    initDb().catch((error) => {
        console.error('Error inicializando DB:', error);
    });
}

