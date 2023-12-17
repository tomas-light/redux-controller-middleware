import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  plugins: [
    react(),
    typescript({
      experimentalDecorators: true,
    }),
  ],
});
