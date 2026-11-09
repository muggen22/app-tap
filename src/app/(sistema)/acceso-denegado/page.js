import Link from "next/link";

export const metadata = {
  title: "Acceso denegado | TecnoSur",
};

export default function PaginaAccesoDenegado() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-red-700">Acceso denegado</h1>
      <p className="mt-2 text-slate-700">
        Tu perfil no tiene permiso para ver esta sección. Si crees que es un error,
        consulta con el personal administrativo.
      </p>
      <Link href="/" className="mt-6 inline-block text-blue-700 underline">
        Volver al inicio
      </Link>
    </div>
  );
}
