"use server";
// Acciones del servidor de HU-02. Cada una valida el rol antes de hacer algo.
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/sesion";
import { esquemaCrearUsuario, esquemaEditarUsuario } from "@/lib/validaciones/usuarios";

// Lee solo los campos esperados del formulario
function leer(formData) {
  const campo = (n) => String(formData.get(n) ?? "");
  return { nombre: campo("nombre"), email: campo("email"), rol: campo("rol"), password: campo("password") };
}

// Respuesta con errores: devuelve lo escrito (sin la contrasena) para no perderlo
function conErrores(errores, valores) {
  return { errores, valores: { ...valores, password: "" } };
}

// Correo repetido: Prisma responde con el codigo P2002 (valor unico duplicado)
const correoDuplicado = (e) => e?.code === "P2002";

export async function crearUsuario(estadoAnterior, formData) {
  await requireRole("ADMINISTRATIVO");
  const valores = leer(formData);
  const r = esquemaCrearUsuario.safeParse(valores);
  if (!r.success) return conErrores(z.flattenError(r.error).fieldErrors, valores);

  const { password, ...datos } = r.data;
  try {
    await prisma.usuario.create({ data: { ...datos, passwordHash: await bcrypt.hash(password, 10) } });
  } catch (e) {
    if (correoDuplicado(e)) return conErrores({ email: ["Ya existe un usuario con ese correo."] }, valores);
    throw e;
  }
  revalidatePath("/usuarios");
  redirect("/usuarios?ok=creado");
}

// "id" llega fijado desde la pagina con editarUsuario.bind(null, id)
export async function editarUsuario(id, estadoAnterior, formData) {
  const yo = await requireRole("ADMINISTRATIVO");
  const valores = leer(formData);
  const r = esquemaEditarUsuario.safeParse(valores);
  if (!r.success) return conErrores(z.flattenError(r.error).fieldErrors, valores);

  // Evita que el administrador se quite su propio acceso
  if (Number(yo.id) === id && r.data.rol !== "ADMINISTRATIVO") {
    return conErrores({ rol: ["No puede quitarse a sí mismo el rol Administrativo."] }, valores);
  }

  const { password, ...datos } = r.data;
  if (password) datos.passwordHash = await bcrypt.hash(password, 10); // solo si escribio una nueva
  try {
    await prisma.usuario.update({ where: { id }, data: datos });
  } catch (e) {
    if (correoDuplicado(e)) return conErrores({ email: ["Ya existe un usuario con ese correo."] }, valores);
    throw e;
  }
  revalidatePath("/usuarios");
  redirect("/usuarios?ok=editado");
}

// Activa o desactiva (los usuarios nunca se eliminan)
export async function cambiarEstado(id) {
  const yo = await requireRole("ADMINISTRATIVO");
  if (Number(yo.id) === id) return { error: "No puede desactivar su propia cuenta." };

  const usuario = await prisma.usuario.findUnique({ where: { id }, select: { activo: true } });
  if (!usuario) return { error: "Usuario no encontrado." };

  await prisma.usuario.update({ where: { id }, data: { activo: !usuario.activo } });
  revalidatePath("/usuarios");
  return { ok: true };
}