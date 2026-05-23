<!-- Неделя 9 | status: Parsed: -->

* [задание следующей недели](https://gist.github.com/kaineer/1f12aebb5583399f1469d3699fe8248c)

 * Создаем проект в vite с указанием типа vanilla + typescript
 * Заменяем содержимое vite.config.js (ну или создаем файл заново) из gist
 * Добавляем код в Task.ts и TaskManager.ts
 * Файл todo.json -- вариант того, как должно получиться

```typescript
// Так можно сохранить todo.json
import { TaskManager } from "./models/TaskManager";

const tm = new TaskManager();

const id = tm.addTask("Hello");
tm.addTask("Goodbye");
tm.closeTask(id);

console.log(tm.availableTasks());

tm.save("todo.json");
```

```typescript
// Так его можно считать
import { TaskManager } from "./models/TaskManager";

const tm = new TaskManager();
(async () => {
  await tm.load("todo.json");
  console.log(tm.availableTasks());
})();
```

 * **ВАЖНО** при сохранении в json даты преобразуются к типу string. После чтения с диска необходимо преобразовывать дату обратно к типу Date.

---

## models/Task.ts

```typescript
// src/models/Task.ts
//
export interface ITask {
  title: string;
  complete: boolean;
  id: number;
  createdAt: Date;
}

export type STask = Omit<ITask, 'createdAt'> & { createdAt: string };

export interface TaskActions {
  close: () => void;
  isComplete: () => boolean;
}

export class Task implements ITask, TaskActions {
// ... ваш код тут
}
```

---

## models/TaskManager.ts

```typescript
// src/models/TaskManager.ts
//

import { Task, type STask } from "./Task";
import { readFile, writeFile } from "fs/promises";

interface TaskManagerActions {
  load: (filename: string) => Promise<void>;
  save: (filename: string) => Promise<void>;
  addTask: (title: string) => number;
  findTask: (id: number) => Task | null;
  closeTask: (id: number) => void;

  // Задания, для которых isComplete() => false
  availableTasks: () => Task[];
}
    
export class TaskManager implements TaskManagerActions {
// ... ваш код тут
}
```

---

## todo.json

```json
[
  {
    "id": 1,
    "title": "Hello",
    "complete": true,
    "createdAt": "Thu, 12 Mar 2026 08:01:32 GMT"
  },
  {
    "id": 2,
    "title": "Goodbye",
    "complete": false,
    "createdAt": "Thu, 12 Mar 2026 08:01:32 GMT"
  }
]
```

---

## vite.config.js

```javascript
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
```
