import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset URLs keep the static build portable across GitHub Pages,
  // local previews, and custom static hosts without knowing the repository name.
  base: './',
  plugins: [react(), tailwindcss()],
});
