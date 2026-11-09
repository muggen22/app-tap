// Matriz de permisos del sistema (seccion 6 del documento de contexto).
// Este archivo no usa la base de datos: lo puede importar src/proxy.js.
//
// "lista: false" = el modulo aun no esta construido. El menu lo muestra en gris
// y sin enlace. Cada historia cambia su modulo a "lista: true" al terminarse.

export const NOMBRE_ROL = {
  ADMINISTRATIVO: "Administrativo",
  BODEGA: "Bodega",
  SUPERVISOR: "Supervisor",
  GERENCIA: "Gerencia",
};

export const MODULOS = [
  { ruta: "/usuarios", titulo: "Usuarios", roles: ["ADMINISTRATIVO"], lista: true }, // HU-02
  { ruta: "/catalogos", titulo: "Categorías, proveedores y trabajadores", roles: ["ADMINISTRATIVO", "BODEGA"], lista: false }, // HU-03
  { ruta: "/productos", titulo: "Productos, unidades y entradas", roles: ["BODEGA"], lista: false }, // HU-04, HU-05
  { ruta: "/asignaciones", titulo: "Asignar y devolver equipos", roles: ["BODEGA"], lista: false }, // HU-06, HU-07
  { ruta: "/consumos", titulo: "Consumo de insumos", roles: ["BODEGA"], lista: false }, // HU-08
  { ruta: "/mermas", titulo: "Registrar mermas", roles: ["BODEGA"], lista: false }, // HU-09
  { ruta: "/existencias", titulo: "Existencias", roles: ["SUPERVISOR", "BODEGA"], lista: false }, // HU-10
  { ruta: "/consultas/asignaciones", titulo: "Historial de asignaciones", roles: ["SUPERVISOR"], lista: false }, // HU-11
  { ruta: "/consultas/mermas", titulo: "Registros de merma", roles: ["SUPERVISOR", "GERENCIA"], lista: false }, // HU-12
  { ruta: "/informes/trabajadores", titulo: "Equipos por trabajador", roles: ["SUPERVISOR"], lista: false }, // HU-13
  { ruta: "/informes/categorias", titulo: "Productos por categoría", roles: ["GERENCIA"], lista: false }, // HU-14
  { ruta: "/informes/mermas", titulo: "Estadísticas de mermas", roles: ["GERENCIA"], lista: false }, // HU-15
  { ruta: "/solicitudes", titulo: "Solicitudes", roles: ["SUPERVISOR", "BODEGA"], lista: false }, // HU-17, HU-18
];

// Busca el modulo al que pertenece una ruta (el de prefijo mas largo).
// Ej.: "/consultas/mermas/5" -> modulo "/consultas/mermas"
export function moduloDeRuta(pathname) {
  const coincidencias = MODULOS.filter(
    (m) => pathname === m.ruta || pathname.startsWith(m.ruta + "/")
  );
  coincidencias.sort((a, b) => b.ruta.length - a.ruta.length);
  return coincidencias[0] ?? null;
}

// true si el rol puede entrar a la ruta.
// Las rutas que no son de ningun modulo (inicio, acceso denegado) quedan abiertas
// para cualquier usuario con sesion.
export function puedeAcceder(rol, pathname) {
  const modulo = moduloDeRuta(pathname);
  if (!modulo) return true;
  return modulo.roles.includes(rol);
}

export function modulosDelRol(rol) {
  return MODULOS.filter((m) => m.roles.includes(rol));
}
