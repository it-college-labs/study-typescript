export interface ITask {
  title: string;
  complete: boolean;
  id: number;
  createdAt: Date;
}

export type STask = Omit<ITask, "createdAt"> & { createdAt: string };

export class Task implements ITask {
  constructor(
    public id: number,
    public title: string,
    public complete = false,
    public createdAt = new Date(),
  ) {}

  close(): void {
    this.complete = true;
  }

  isComplete(): boolean {
    return this.complete;
  }

  toJSON(): STask {
    return {
      id: this.id,
      title: this.title,
      complete: this.complete,
      createdAt: this.createdAt.toUTCString(),
    };
  }

  static fromSTask(task: STask): Task {
    return new Task(task.id, task.title, task.complete, new Date(task.createdAt));
  }
}
