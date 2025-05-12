import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@sheet-importer/lib": path.resolve(__dirname, "../packages/lib/src"), 
    },
  },
});
