import type { Command } from "../types";

export const done: Command = {
  accept(...argv: string[]) {
    return argv[0] === "done" && Number.isInteger(Number(argv[1]));
  },
  run(taskManager, ...argv) {
    taskManager.closeTask(Number(argv[1]));
    return true;
  },
  description: "done [task-id]: complete task",
};
