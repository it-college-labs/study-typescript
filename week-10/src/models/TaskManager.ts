import { readFile, writeFile } from "fs/promises";
import { Task, type STask } from "./Task";

export class TaskManager {
  private tasks: Task[] = [];
  private nextId = 1;

  async load(filename: string): Promise<void> {
    try {
      const raw = await readFile(filename, "utf-8");
      const data = JSON.parse(raw) as STask[];

      this.tasks = data.map((task) => Task.fromSTask(task));
      this.nextId = this.tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
    } catch (error) {
      if ((error as { code?: string }).code === "ENOENT") {
        this.tasks = [];
        this.nextId = 1;
        return;
      }

      throw error;
    }
  }

  async save(filename: string): Promise<void> {
    await writeFile(filename, JSON.stringify(this.tasks, null, 2), "utf-8");
  }

  addTask(title: string): number {
    const task = new Task(this.nextId, title);
    this.tasks.push(task);
    this.nextId += 1;
    return task.id;
  }

  findTask(id: number): Task | null {
    return this.tasks.find((task) => task.id === id) ?? null;
  }

  closeTask(id: number): void {
    this.findTask(id)?.close();
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  availableTasks(): Task[] {
    return this.tasks.filter((task) => !task.isComplete());
  }

  allTasks(): Task[] {
    return [...this.tasks];
  }
}
