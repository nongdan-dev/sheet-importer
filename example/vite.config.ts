import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // resolve: {
  //   alias: {
  //     "@sheet-importer/lib": path.resolve(__dirname, "../packages/lib"),
  //   },
  // },
  server: {
    port: 3000,
    open: true,
  },

});
