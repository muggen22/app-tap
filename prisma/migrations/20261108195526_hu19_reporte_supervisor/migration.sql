/*
  Warnings:

  - You are about to drop the column `observacion` on the `Asignacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asignacion" DROP COLUMN "observacion",
ADD COLUMN     "fechaReporte" TIMESTAMPTZ(3),
ADD COLUMN     "observacionDevolucion" VARCHAR(255),
ADD COLUMN     "observacionEntrega" VARCHAR(255),
ADD COLUMN     "reportadoPorId" INTEGER,
ADD COLUMN     "reporteSupervisor" VARCHAR(255),
ADD COLUMN     "sinReporteSupervisor" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_reportadoPorId_fkey" FOREIGN KEY ("reportadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- El reporte del supervisor siempre indica quien y cuando
ALTER TABLE "Asignacion" ADD CONSTRAINT "asignacion_reporte_completo"
  CHECK ("reporteSupervisor" IS NULL OR ("reportadoPorId" IS NOT NULL AND "fechaReporte" IS NOT NULL));

-- Una devolucion cerrada debe tener condicion y, ademas,
-- el reporte del supervisor, o la marca "sin reporte" con observacion de bodega
ALTER TABLE "Asignacion" ADD CONSTRAINT "asignacion_devolucion_completa"
  CHECK ("fechaDevolucion" IS NULL OR (
    "estadoDevolucion" IS NOT NULL AND (
      "reporteSupervisor" IS NOT NULL OR
      ("sinReporteSupervisor" = true AND "observacionDevolucion" IS NOT NULL)
    )
  ));