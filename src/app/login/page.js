// Pagina /login (unica ruta publica del sistema)
import Login from "./login"

// Titulo de la pestana del navegador
export const metadata = {
  title: "Iniciar sesión | TecnoSur",
};

export default async function PaginaLogin({ searchParams }) {
  // ?inactivo=1 llega cuando se cerro la sesion de un usuario desactivado
  const { inactivo } = await searchParams;

  return (
    // Tarjeta centrada en la pantalla
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="text-xl font-semibold text-slate-900">TecnoSur</h1>
        <p className="mb-6 text-sm text-slate-600">Sistema de Gestión de Inventario</p>
        {inactivo && (
          <p className="aviso-error mb-4">Su sesión fue cerrada. Si cree que es un error, consulte con el personal administrativo.</p>
        )}
        <Login />
      </div>
    </main>
  );
}