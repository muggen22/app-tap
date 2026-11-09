// Formulario de usuario, compartido entre "Nuevo" y "Editar" (corre en el navegador)
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { NOMBRE_ROL } from "@/lib/permisos";

// accion: crearUsuario o editarUsuario | usuario: datos actuales (solo al editar)
export default function FormularioUsuario({ accion, usuario }) {
  const [estado, enviar, pendiente] = useActionState(accion, null);
  const v = estado?.valores ?? usuario ?? {}; // lo escrito, o los datos actuales
  const err = estado?.errores ?? {};
  const editando = Boolean(usuario);

  return (
    <form action={enviar} className="tarjeta max-w-lg space-y-4">
      <Campo nombre="nombre" etiqueta="Nombre" valor={v.nombre} error={err.nombre} />
      <Campo nombre="email" etiqueta="Correo electrónico" tipo="email" valor={v.email} error={err.email} />

      <div>
        <label htmlFor="rol" className="etiqueta">Rol</label>
        <select id="rol" name="rol" defaultValue={v.rol ?? ""} required className="campo">
          <option value="" disabled>Seleccione un rol</option>
          {Object.entries(NOMBRE_ROL).map(([valor, texto]) => (
            <option key={valor} value={valor}>{texto}</option>
          ))}
        </select>
        {err.rol && <p className="error-campo">{err.rol[0]}</p>}
      </div>

      {/* Al editar, la contrasena es opcional */}
      <Campo nombre="password" tipo="password" error={err.password} requerido={!editando}
        etiqueta={editando ? "Nueva contraseña (opcional)" : "Contraseña"}
                ayuda={(editando ? "Déjela vacía para mantener la actual. " : "") +
          "Mínimo 10 caracteres, con mayúscula, minúscula, número y carácter especial."} />

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={pendiente} className="btn">{pendiente ? "Guardando..." : "Guardar"}</button>
        <Link href="/usuarios" className="btn-sec">Cancelar</Link>
      </div>
    </form>
  );
}

// Un campo de texto con su etiqueta, ayuda y error
function Campo({ nombre, etiqueta, tipo = "text", valor, error, requerido = true, ayuda }) {
  return (
    <div>
      <label htmlFor={nombre} className="etiqueta">{etiqueta}</label>
      <input id={nombre} name={nombre} type={tipo} defaultValue={valor ?? ""} required={requerido} className="campo" />
      {ayuda && <p className="mt-1 text-xs text-slate-500">{ayuda}</p>}
      {error?.map((e) => <p key={e} className="error-campo">{e}</p>)}
    </div>
  );
}