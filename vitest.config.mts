import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Pruebas unitarias en Node para lib/leads y la ruta /api/leads.
// No hace falta jsdom: no se prueban componentes.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
});
