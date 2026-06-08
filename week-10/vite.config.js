import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["cjs", "es"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      external: ["fs", "fs/promises", "path", "os"],
      output: {
        exports: "named",
      },
    },
    target: "node18",
  },
  ssr: {
    target: "node",
  },
});
