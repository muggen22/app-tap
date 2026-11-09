// Ruta /api/salir: cierra la sesion de un usuario desactivado.
// (Una pagina no puede borrar la cookie de sesion; una ruta como esta, si.)
import { signOut } from "@/auth";

export async function GET() {
  await signOut({ redirectTo: "/login?inactivo=1" });
}