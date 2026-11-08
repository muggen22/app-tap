-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRATIVO', 'BODEGA', 'SUPERVISOR', 'GERENCIA');

-- CreateEnum
CREATE TYPE "CargoTrabajador" AS ENUM ('TECNICO', 'SUPERVISOR', 'ADMINISTRATIVO');

-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('HERRAMIENTA', 'EQUIPO', 'INSUMO');

-- CreateEnum
CREATE TYPE "EstadoUnidad" AS ENUM ('DISPONIBLE', 'ASIGNADO', 'DANADO', 'BAJA');

-- CreateEnum
CREATE TYPE "EstadoEquipo" AS ENUM ('BUENO', 'REGULAR', 'DANADO');

-- CreateEnum
CREATE TYPE "CausaMerma" AS ENUM ('DANO', 'ROBO', 'EXTRAVIO', 'VENCIMIENTO');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'ATENDIDA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "marca" VARCHAR(100),
    "categoriaId" INTEGER NOT NULL,
    "tipo" "TipoProducto" NOT NULL,
    "descripcion" VARCHAR(255),
    "stock" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "stockMinimo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "unidadMedida" VARCHAR(20) NOT NULL DEFAULT 'unidad',
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnidadEquipo" (
    "id" SERIAL NOT NULL,
    "codigoUnidad" VARCHAR(50) NOT NULL,
    "productoId" INTEGER NOT NULL,
    "estado" "EstadoUnidad" NOT NULL DEFAULT 'DISPONIBLE',
    "fechaAdquisicion" DATE NOT NULL,
    "observacion" VARCHAR(255),
    "entradaId" INTEGER,

    CONSTRAINT "UnidadEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabajador" (
    "id" SERIAL NOT NULL,
    "codigoTrabajador" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "cargo" "CargoTrabajador" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Trabajador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrada" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productoId" INTEGER NOT NULL,
    "proveedorId" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "responsableId" INTEGER NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asignacion" (
    "id" SERIAL NOT NULL,
    "unidadId" INTEGER NOT NULL,
    "trabajadorId" INTEGER NOT NULL,
    "fechaEntrega" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaDevolucion" TIMESTAMPTZ(3),
    "estadoEntrega" "EstadoEquipo" NOT NULL,
    "estadoDevolucion" "EstadoEquipo",
    "responsableId" INTEGER NOT NULL,
    "observacion" VARCHAR(255),
    "solicitudId" INTEGER,

    CONSTRAINT "Asignacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumo" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productoId" INTEGER NOT NULL,
    "trabajadorId" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "responsableId" INTEGER NOT NULL,
    "solicitudId" INTEGER,

    CONSTRAINT "Consumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merma" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productoId" INTEGER NOT NULL,
    "unidadId" INTEGER,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "causa" "CausaMerma" NOT NULL,
    "observacion" VARCHAR(255),
    "responsableId" INTEGER NOT NULL,

    CONSTRAINT "Merma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trabajadorId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "solicitanteId" INTEGER NOT NULL,
    "atendidaPorId" INTEGER,
    "fechaRespuesta" TIMESTAMPTZ(3),
    "motivoRechazo" VARCHAR(255),

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_nombre_key" ON "Proveedor"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE INDEX "Producto_categoriaId_idx" ON "Producto"("categoriaId");

-- CreateIndex
CREATE INDEX "Producto_tipo_idx" ON "Producto"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "UnidadEquipo_codigoUnidad_key" ON "UnidadEquipo"("codigoUnidad");

-- CreateIndex
CREATE INDEX "UnidadEquipo_productoId_idx" ON "UnidadEquipo"("productoId");

-- CreateIndex
CREATE INDEX "UnidadEquipo_estado_idx" ON "UnidadEquipo"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Trabajador_codigoTrabajador_key" ON "Trabajador"("codigoTrabajador");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Entrada_productoId_idx" ON "Entrada"("productoId");

-- CreateIndex
CREATE INDEX "Entrada_fecha_idx" ON "Entrada"("fecha");

-- CreateIndex
CREATE INDEX "Asignacion_unidadId_idx" ON "Asignacion"("unidadId");

-- CreateIndex
CREATE INDEX "Asignacion_trabajadorId_idx" ON "Asignacion"("trabajadorId");

-- CreateIndex
CREATE INDEX "Asignacion_fechaEntrega_idx" ON "Asignacion"("fechaEntrega");

-- CreateIndex
CREATE INDEX "Consumo_productoId_idx" ON "Consumo"("productoId");

-- CreateIndex
CREATE INDEX "Consumo_trabajadorId_idx" ON "Consumo"("trabajadorId");

-- CreateIndex
CREATE INDEX "Consumo_fecha_idx" ON "Consumo"("fecha");

-- CreateIndex
CREATE INDEX "Merma_productoId_idx" ON "Merma"("productoId");

-- CreateIndex
CREATE INDEX "Merma_causa_idx" ON "Merma"("causa");

-- CreateIndex
CREATE INDEX "Merma_fecha_idx" ON "Merma"("fecha");

-- CreateIndex
CREATE INDEX "Solicitud_estado_idx" ON "Solicitud"("estado");

-- CreateIndex
CREATE INDEX "Solicitud_trabajadorId_idx" ON "Solicitud"("trabajadorId");

-- CreateIndex
CREATE INDEX "Solicitud_solicitanteId_idx" ON "Solicitud"("solicitanteId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnidadEquipo" ADD CONSTRAINT "UnidadEquipo_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnidadEquipo" ADD CONSTRAINT "UnidadEquipo_entradaId_fkey" FOREIGN KEY ("entradaId") REFERENCES "Entrada"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "UnidadEquipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_trabajadorId_fkey" FOREIGN KEY ("trabajadorId") REFERENCES "Trabajador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumo" ADD CONSTRAINT "Consumo_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumo" ADD CONSTRAINT "Consumo_trabajadorId_fkey" FOREIGN KEY ("trabajadorId") REFERENCES "Trabajador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumo" ADD CONSTRAINT "Consumo_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumo" ADD CONSTRAINT "Consumo_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merma" ADD CONSTRAINT "Merma_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merma" ADD CONSTRAINT "Merma_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "UnidadEquipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merma" ADD CONSTRAINT "Merma_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_trabajadorId_fkey" FOREIGN KEY ("trabajadorId") REFERENCES "Trabajador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_atendidaPorId_fkey" FOREIGN KEY ("atendidaPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
