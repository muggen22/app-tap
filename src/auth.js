// Configuracion de Auth.js (next-auth 5.0.0-beta.32)
// Proveedor de credenciales: correo y contrasena guardada con bcryptjs.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const esquemaLogin = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1),
});
console.log("[diagnostico] AUTH_SECRET largo:", process.env.AUTH_SECRET?.length ?? "NO DEFINIDO");
export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET, // le pasa la clave a Auth.js de forma explicita
  session: {
    strategy: "jwt", // obligatorio con el proveedor de credenciales
    maxAge: 8 * 60 * 60, // 8 horas: una jornada de trabajo
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credenciales) {
        const datos = esquemaLogin.safeParse(credenciales);
        if (!datos.success) return null;

        const { email, password } = datos.data;
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        // Usuario inexistente, desactivado o clave incorrecta: siempre el mismo
        // resultado (null). Asi el mensaje es generico y no revela cual fallo.
        if (!usuario || !usuario.activo) return null;

        const coincide = await bcrypt.compare(password, usuario.passwordHash);
        if (!coincide) return null;

        return {
          id: String(usuario.id),
          name: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        };
      },
    }),
  ],
  callbacks: {
    // Se ejecuta al iniciar sesion: guarda id y rol dentro del token
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
      }
      return token;
    },
    // Lo que queda disponible en auth() y en el proxy
    session({ session, token }) {
      session.user.id = token.id;
      session.user.rol = token.rol;
      return session;
    },
  },
});
