import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "c8", // Ensure "c8" is explicitly set
      reporter: ["text", "json", "html", "lcov"],
      all: true, // Ensures all files are considered for coverage
      include: ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx"],
    },
  },
});
