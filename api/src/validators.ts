import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Usuario requerido")
        .max(100, "Usuario demasiado largo"),
    password: z
        .string()
        .min(1, "Contraseña requerida")
        .max(100, "Contraseña demasiado larga"),
});

export const leadSchema = z.object({
    nombre: z
        .string()
        .min(1, "El nombre es obligatorio")
        .max(100, "El nombre es demasiado largo"),
    email: z
        .string()
        .email("El correo electrónico no es válido")
        .max(100, "El correo electrónico es demasiado largo"),
    telefono: z
        .string()
        .max(20, "El teléfono es demasiado largo")
        .optional()
        .default(""),
    mensaje: z
        .string()
        .max(1000, "El mensaje es demasiado largo")
        .optional()
        .default(""),
    tipo: z
        .string()
        .min(1, "El tipo es obligatorio")
        .max(50, "El tipo es demasiado largo"),
    codigo: z
        .string()
        .nullable()
        .optional(),
    descuento: z
        .string()
        .nullable()
        .optional(),
    id: z
        .string()
        .optional(),
    fecha: z
        .string()
        .optional(),
});