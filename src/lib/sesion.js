// Ocultar botones no basta: esta funcion es la que realmente bloquea el acceso.
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Lee el usuario actual DESDE LA BASE (no solo desde la cookie), para que
// desactivar a alguien o cambiar su rol tenga efecto de inmediato.
// cache(): si layout y pagina la llaman en la misma visita, consulta una sola vez.
const usuarioActual = cache(async () => {
  const sesion = await auth();
  if (!sesion?.user?.id) return null;
  return prisma.usuario.findUnique({
    where: { id: Number(sesion.user.id) },
    select: { id: true, nombre: true, email: true, rol: true, activo: true },
  });
});

export async function requireRole(...roles) {
  const sesion = await auth();
  if (!sesion?.user) redirect("/login"); // sin sesion -> al login

  const usuario = await usuarioActual();
  if (!usuario || !usuario.activo) redirect("/api/salir"); // desactivado -> cierra su sesion

  if (roles.length > 0 && !roles.includes(usuario.rol)) redirect("/acceso-denegado");

  // Devuelve id, name, email y rol (mismo formato que la sesion)
  return { id: String(usuario.id), name: usuario.nombre, email: usuario.email, rol: usuario.rol };
}