import type { Command } from "../types";

export const add: Command = {
  accept(...argv: string[]) {
    return argv[0] === "add" && argv.length > 1;
  },
  run(taskManager, ...argv) {
    taskManager.addTask(argv.slice(1).join(" "));
    return true;
  },
  description: "add [long title]: add new task",
};
