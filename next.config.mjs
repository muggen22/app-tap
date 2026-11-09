/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sin cacheComponents: todas las paginas dependen de la sesion y del rol,
  // y deben mostrar los datos actualizados al momento de consultar.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;