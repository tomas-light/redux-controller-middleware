import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';
import { transformer } from 'cheap-di-ts-transform';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    minify: false,
  },
  plugins: [
    react(),
    typescript({
      experimentalDecorators: true,
      transformers: {
        before: [
          {
            type: 'program',
            factory: (program) =>
              transformer(
                { program },
                {
                  debug: true,
                  addDetailsToUnknownParameters: true,
                  logRegisteredMetadata: true,
                  errorsLogLevel: 'debug',
                  esmImports: true,
                }
              ),
          },
        ],
      },
    }),
  ],
});
