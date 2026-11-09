// Cliente unico de Prisma para toda la aplicacion.
// En desarrollo Next recarga los modulos a cada cambio; guardarlo en globalThis
// evita abrir una conexion nueva a PostgreSQL en cada recarga.
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalParaPrisma = globalThis;

function crearCliente() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalParaPrisma.prisma ?? crearCliente();

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
