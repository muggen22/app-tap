import { requireRole } from "@/lib/sesion";
import { modulosDelRol, NOMBRE_ROL } from "@/lib/permisos";

export const metadata = {
  title: "Inicio | TecnoSur",
};

export default async function PaginaInicio() {
  const usuario = await requireRole();
  const modulos = modulosDelRol(usuario.rol);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Bienvenido, {usuario.name}</h1>
      <p className="mt-1 text-slate-600">
        Perfil: <strong>{NOMBRE_ROL[usuario.rol]}</strong>
      </p>

      <h2 className="mt-8 mb-3 text-lg font-medium">Tus módulos</h2>
      <ul className="list-disc space-y-1 pl-6 text-slate-700">
        {modulos.map((m) => (
          <li key={m.ruta}>
            {m.titulo}
            {!m.lista && <span className="text-slate-400"> (en desarrollo)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
