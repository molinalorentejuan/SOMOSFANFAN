// Tipos para leads
export type Lead = {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    mensaje: string;
    tipo: string;
    codigo?: string | null;
    descuento?: string | null;
    fecha: string;
};

// Base de datos en memoria (fallback si no hay PostgreSQL)
export const db: {
    leads: Lead[];
} = {
    leads: [],
};
