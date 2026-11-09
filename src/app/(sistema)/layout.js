// Estructura comun de todas las paginas con sesion: menu lateral + contenido.
// La carpeta "(sistema)" entre parentesis no aparece en la URL.
import Link from "next/link";
import { signOut } from "@/auth";
import { requireRole } from "@/lib/sesion";
import { modulosDelRol, NOMBRE_ROL } from "@/lib/permisos";

export default async function LayoutSistema({ children }) {
  const usuario = await requireRole();
  const modulos = modulosDelRol(usuario.rol);

  async function cerrarSesion() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="flex w-64 shrink-0 flex-col bg-slate-800 text-slate-100">
        <div className="border-b border-slate-700 px-5 py-4">
          <p className="text-lg font-semibold">TecnoSur</p>
          <p className="text-xs text-slate-400">Gestión de Inventario</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="block rounded px-3 py-2 hover:bg-slate-700">
                Inicio
              </Link>
            </li>
            {modulos.map((m) => (
              <li key={m.ruta}>
                {m.lista ? (
                  <Link href={m.ruta} className="block rounded px-3 py-2 hover:bg-slate-700">
                    {m.titulo}
                  </Link>
                ) : (
                  <span className="block cursor-default px-3 py-2 text-slate-500" title="En desarrollo">
                    {m.titulo}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-700 px-5 py-4 text-sm">
          <p className="font-medium">{usuario.name}</p>
          <p className="mb-3 text-xs text-slate-400">{NOMBRE_ROL[usuario.rol]}</p>
          <form action={cerrarSesion}>
            <button type="submit" className="text-xs text-slate-300 underline hover:text-white">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
