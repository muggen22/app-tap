// Pagina /usuarios: listado de usuarios (solo Administrativo)
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/sesion";
import { NOMBRE_ROL } from "@/lib/permisos";
import BotonEstado from "./boton-estado";

export const metadata = { title: "Usuarios | TecnoSur" };

// Mensajes que llegan en la direccion despues de guardar (?ok=...)
const AVISOS = { creado: "Usuario creado correctamente.", editado: "Cambios guardados correctamente." };

export default async function PaginaUsuarios({ searchParams }) {
  const yo = await requireRole("ADMINISTRATIVO");
  const { ok } = await searchParams;

  // Activos primero, luego por nombre
  const usuarios = await prisma.usuario.findMany({
    orderBy: [{ activo: "desc" }, { nombre: "asc" }],
    select: { id: true, nombre: true, email: true, rol: true, activo: true },
  });

  return (
    <div>
      {/* Encabezado: titulo + accion principal a la derecha */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuarios</h1>
          <p className="text-sm text-slate-600">Los usuarios no se eliminan: se desactivan. Un usuario desactivado no puede iniciar sesión.</p>
        </div>
        <Link href="/usuarios/nuevo" className="btn">Nuevo usuario</Link>
      </div>

      {AVISOS[ok] && <p className="aviso-ok mb-4">{AVISOS[ok]}</p>}

      <table className="tabla">
        <thead>
          <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className={u.activo ? "" : "text-slate-400"}>
              <td>{u.nombre}{String(u.id) === yo.id && <span className="text-slate-400"> (tú)</span>}</td>
              <td>{u.email}</td>
              <td>{NOMBRE_ROL[u.rol]}</td>
              <td><span className={u.activo ? "etq-ok" : "etq"}>{u.activo ? "Activo" : "Inactivo"}</span></td>
              <td className="space-x-3">
                <Link href={`/usuarios/${u.id}`} className="text-blue-700 hover:underline">Editar</Link>
                {/* No se muestra para la propia cuenta */}
                {String(u.id) !== yo.id && <BotonEstado id={u.id} nombre={u.nombre} activo={u.activo} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}