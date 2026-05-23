import type { Task } from "../../models/Task";
import type { Command } from "../types";

function printTask(task: Task): void {
  const status = task.isComplete() ? "DONE" : "TODO";
  console.log(` ${task.id} [${status}] ${task.title}`);
}

export const list: Command = {
  accept(...argv: string[]) {
    return argv[0] === "ls" || argv[0] === "list";
  },
  run(taskManager, ...argv) {
    const showAll = argv.includes("-a");
    const tasks = showAll ? taskManager.allTasks() : taskManager.availableTasks();

    tasks.forEach(printTask);
    return false;
  },
  description: "ls, list [-a]: list available [all] todo tasks",
};
