import { Pool } from 'pg';
import { db } from './data';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL no configurada. Usando modo desarrollo con memoria.');
}

// Pool de conexiones PostgreSQL
export const pool = DATABASE_URL
    ? new Pool({
          connectionString: DATABASE_URL,
          ssl: DATABASE_URL.includes('railway') || DATABASE_URL.includes('localhost') === false
              ? { rejectUnauthorized: false }
              : false,
      })
    : null;

// Exportar db para fallback en memoria
export { db };

// Verificar conexión
export async function initDb() {
    if (!pool) {
        console.log('📦 Modo desarrollo: usando almacenamiento en memoria');
        return;
    }

    try {
        await pool.query('SELECT NOW()');
        console.log('✅ PostgreSQL conectado');
        
        // Ejecutar migraciones
        await runMigrations();
    } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error);
        throw error;
    }
}

// Migraciones
async function runMigrations() {
    if (!pool) return;

    try {
        // Crear tabla de leads
        await pool.query(`
            CREATE TABLE IF NOT EXISTS leads (
                id VARCHAR(255) PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                telefono VARCHAR(20) DEFAULT '',
                mensaje TEXT DEFAULT '',
                tipo VARCHAR(50) NOT NULL,
                codigo VARCHAR(50),
                descuento VARCHAR(10),
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear índice para búsquedas por email y fecha
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)
        `);
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_leads_fecha ON leads(fecha DESC)
        `);

        console.log('✅ Migraciones ejecutadas');
    } catch (error) {
        console.error('❌ Error en migraciones:', error);
        throw error;
    }
}

// Cerrar conexión
export async function closeDb() {
    if (pool) {
        await pool.end();
        console.log('🔌 Conexión PostgreSQL cerrada');
    }
}

