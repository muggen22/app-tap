// Proteccion de rutas (en Next 16 este archivo reemplaza a "middleware").
// - Sin sesion            -> /login
// - Con sesion en /login  -> inicio
// - Rol sin permiso       -> /acceso-denegado
// Es una primera barrera: cada pagina y accion igual valida con requireRole().
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { puedeAcceder } from "@/lib/permisos";

const RUTAS_PUBLICAS = ["/login"];

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const usuario = req.auth?.user;
  const esPublica = RUTAS_PUBLICAS.includes(pathname);

  if (!usuario) {
    if (esPublica) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (esPublica) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!puedeAcceder(usuario.rol, pathname)) {
    return NextResponse.redirect(new URL("/acceso-denegado", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Todo menos: rutas internas de Auth.js, archivos de Next e imagenes
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)",
  ],
};
