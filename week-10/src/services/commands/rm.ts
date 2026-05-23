import type { Command } from "../types";

export const rm: Command = {
  accept(...argv: string[]) {
    return argv[0] === "rm" && Number.isInteger(Number(argv[1]));
  },
  run(taskManager, ...argv) {
    taskManager.removeTask(Number(argv[1]));
    return true;
  },
  description: "rm [task-id]: remove task",
};
