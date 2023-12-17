import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';
import { transformer } from 'cheap-di-ts-transform';

export default defineConfig({
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
                  esmImports: true,
                }
              ),
          },
        ],
      },
    }),
  ],
});
