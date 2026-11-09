// Reglas de validacion (zod) para crear y editar usuarios (HU-02)
import { z } from "zod";

const ROLES = ["ADMINISTRATIVO", "BODEGA", "SUPERVISOR", "GERENCIA"];

// Campos comunes a crear y editar
const base = {
  nombre: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres.").max(100, "Máximo 100 caracteres."),
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Ingrese un correo válido." })),
  rol: z.enum(ROLES, { error: "Seleccione un rol." }),
};

// bcrypt solo usa los primeros 72 caracteres: por eso el maximo
// Politica de contrasenas seguras (bcrypt solo usa los primeros 72 caracteres)
const clave = z.string()
  .min(10, "La contraseña debe tener al menos 10 caracteres.")
  .max(72, "Máximo 72 caracteres.")
  .regex(/[a-z]/, "Debe incluir al menos una letra minúscula.")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula.")
  .regex(/[0-9]/, "Debe incluir al menos un número.")
  .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un carácter especial (por ejemplo: ! @ # $ %).");

// Crear: la contrasena es obligatoria
export const esquemaCrearUsuario = z.object({ ...base, password: clave });

// Editar: la contrasena es opcional (vacia = se mantiene la actual)
export const esquemaEditarUsuario = z.object({ ...base, password: z.union([z.literal(""), clave]) });