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
