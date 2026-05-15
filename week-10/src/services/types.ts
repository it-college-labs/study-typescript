// src/services/types.ts

import type { TaskManager } from "../models/TaskManager";

export interface Command {
  accept(...argv: string[]): boolean;
  run(taskManager: TaskManager, ...argv: string[]): boolean;
  description: string | null;
}
