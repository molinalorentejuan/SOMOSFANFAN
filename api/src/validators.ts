import { z } from 'zod';

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(30, "El nombre de usuario debe tener como máximo 30 caracteres"),
    password: z
        .string()
        .min(3, "La contraseña debe tener al menos 3 caracteres")
        .max(30, "La contraseña debe tener como máximo 30 caracteres"), // límite amplio pero razonable
    email: z
        .string()
        .email("El correo electrónico no es válido")
        .max(30, "El correo electrónico es demasiado largo"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email("El correo electrónico no es válido")
        .max(30, "El correo electrónico es demasiado largo"),
    password: z
        .string()
        .min(3, "La contraseña debe tener al menos 3 caracteres")
        .max(30, "La contraseña debe tener como máximo 30 caracteres"),
});

export const restaurantSchema = z.object({
    name: z
        .string()
        .min(1, "El nombre es obligatorio")
        .max(40, "El nombre es demasiado largo"),
    description: z
        .string()
        .max(500, "La descripción es demasiado larga")
        .optional(),
    address: z
        .string()
        .min(10, "La ubicación es obligatoria")
        .max(40, "La dirección es demasiado larga")
        .optional(),
    cuisine: z
        .string()
        .max(40, "El tipo de cocina es demasiado largo")
        .optional()
        .default(""),
    phone: z
        .string()
        .max(20, "El teléfono es demasiado largo")
        .optional()
        .default(""),
    image: z
        .string()
        .max(3000000, "La imagen es demasiado grande")
        .optional(),
    openingHours: z
        .string()
        .max(40, "El horario es demasiado largo")
        .optional()
        .default(""),
    rating: z
        .number()
        .min(0, "La puntuación mínima es 0")
        .max(5, "La puntuación máxima es 5")
        .default(4)
        .optional(),
    lat: z
        .number()
        .gte(-90, "La latitud mínima es -90")
        .lte(90, "La latitud máxima es 90")
        .optional(),
    lng: z
        .number()
        .gte(-180, "La longitud mínima es -180")
        .lte(180, "La longitud máxima es 180")
        .optional(),
});

export const commentSchema = z.object({
    text: z
        .string()
        .min(1, "El comentario no puede estar vacío")
        .max(500, "El comentario es demasiado largo"),
    rating: z
        .number()
        .min(0, "La puntuación mínima es 0")
        .max(5, "La puntuación máxima es 5")
        .optional(),
});