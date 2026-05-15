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
