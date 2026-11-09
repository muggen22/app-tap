// Pagina /usuarios/[id]: editar un usuario
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/sesion";
import { editarUsuario } from "../acciones";
import Usuario from "../usuario";

export const metadata = { title: "Editar usuario | TecnoSur" };

export default async function PaginaEditarUsuario({ params }) {
  await requireRole("ADMINISTRATIVO");

  // El id viene en la direccion: si no es un numero valido o no existe -> 404
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: { nombre: true, email: true, rol: true },
  });
  if (!usuario) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar usuario</h1>
      {/* bind fija el id: la accion recibe (id, estadoAnterior, formData) */}
      <Usuario accion={editarUsuario.bind(null, id)} usuario={usuario} />
    </div>
  );
}