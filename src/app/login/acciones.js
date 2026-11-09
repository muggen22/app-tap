"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

// Accion del formulario de login (se ejecuta en el servidor)
export async function iniciarSesion(estadoAnterior, formData) {
  const email = String(formData.get("email") ?? "");

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    // Credenciales incorrectas: mensaje generico
    if (error instanceof AuthError) {
      return { error: "Correo o contraseña incorrectos.", email };
    }
    // Si el login fue correcto, signIn "lanza" una redireccion: hay que dejarla pasar
    throw error;
  }
}
