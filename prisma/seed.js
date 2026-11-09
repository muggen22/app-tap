// Semilla: crea el primer usuario administrativo y un usuario de prueba por rol.
// Se ejecuta con:  npx prisma db seed
// Si un correo ya existe, no lo modifica (se puede ejecutar varias veces).
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

// Conexion propia (este script corre fuera de Next)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Datos del administrador, leidos desde .env
  const nombre = process.env.ADMIN_NOMBRE ?? "Administrador";
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el archivo .env");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 8 caracteres");
  }

  // Cifra la clave (10 = rondas de bcrypt)
  const passwordHash = await bcrypt.hash(password, 10);

  // Usuarios de prueba para revisar el menu de cada rol (HU-01).
  // Usan la misma clave que el administrador. Se pueden desactivar en HU-02.
  const usuarios = [
    { nombre, email, rol: "ADMINISTRATIVO" },
    { nombre: "Usuario Bodega", email: "bodega@tecnosur.cl", rol: "BODEGA" },
    { nombre: "Usuario Supervisor", email: "supervisor@tecnosur.cl", rol: "SUPERVISOR" },
    { nombre: "Usuario Gerencia", email: "gerencia@tecnosur.cl", rol: "GERENCIA" },
  ];

  // upsert: crea el usuario si no existe; si existe, no lo cambia
  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
    console.log(`Usuario listo: ${u.email} (${u.rol})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());