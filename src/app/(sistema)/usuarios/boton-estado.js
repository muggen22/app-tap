// Boton Desactivar / Activar con confirmacion (corre en el navegador)
"use client";

import { useState, useTransition } from "react";
import { cambiarEstado } from "./acciones";

export default function BotonEstado({ id, nombre, activo }) {
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState("");

  function alPresionar() {
    // Confirmacion antes de una accion que cambia el acceso de alguien
    if (!confirm(`¿Seguro que desea ${activo ? "desactivar" : "activar"} a ${nombre}?`)) return;
    iniciar(async () => {
      const r = await cambiarEstado(id);
      setError(r?.error ?? "");
    });
  }

  return (
    <>
      <button type="button" onClick={alPresionar} disabled={pendiente}
        className={activo ? "text-red-700 hover:underline" : "text-green-700 hover:underline"}>
        {pendiente ? "Guardando..." : activo ? "Desactivar" : "Activar"}
      </button>
      {error && <span className="ml-2 text-xs text-red-700">{error}</span>}
    </>
  );
}