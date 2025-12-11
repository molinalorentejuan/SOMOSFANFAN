// Tipos para el sistema FanFan
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
