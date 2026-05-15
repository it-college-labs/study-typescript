import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      // Опционально: исключить тестовые файлы из деклараций
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['cjs', 'es'], // Создаем и CommonJS, и ESM версии
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true, // Полезно для отладки в Node.js
    minify: false, // Не минифицируем для Node.js
    rollupOptions: {
      // Внешние зависимости, которые не нужно бандлить
      external: [
        'fs',
        'fs/promises',
        'path',
        'os',
      ],
      output: {
        // Для ESM формата
        esModule: true,
        // Для CommonJS формата
        exports: 'named',
        // Указываем, что сборка для Node.js
        generatedCode: {
          constBindings: true,
          objectShorthand: true,
        },
      },
    },
    // Указываем цель для Node.js
    target: 'node18', // или ваша версия Node.js
  },
  // Опции для режима разработки
  server: {
    // Не открывать браузер автоматически
    open: false,
  },
  // Определяем окружение как Node.js
  ssr: {
    // Включаем SSR режим для Node.js оптимизаций
    target: 'node',
    // Внешние зависимости, которые не нужно обрабатывать
    noExternal: [], // Укажите зависимости, которые нужно включить в бандл
  },
});
