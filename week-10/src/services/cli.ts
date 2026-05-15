// src/services/cli.ts

// Основной движок
//   * опрашивает команды
//   * выполняет подходящую команду
//   * перед этим подгружает todo.json
//   * если команда меняла список задач, сохраняет todo.json

import { TaskManager } from "../models/TaskManager";
import { createHelpCommand } from "./commands/help";
import type { Command } from "./types";

import { list } from "./commands/list";
import { add } from "./commands/add";
import { done } from "./commands/done";
import { rm } from "./commands/rm";

const withTaskManager = async (fn: (m: TaskManager) => boolean) => {
  const todoPath = "./todo.json";
  const tm = new TaskManager();
  await tm.load(todoPath);
  if (fn(tm)) {
    await tm.save(todoPath);
  }
};

export const applyCli =
  (commands: Command[]) =>
  async (...argv: string[]) => {
    const cmd = commands.find((c) => c.accept(...argv));

    if (cmd) {
      await withTaskManager((tm) => cmd.run(tm, ...argv));
    } else {
      console.log("Unknown command: [" + argv.join(" ") + "]");
    }
  };

const commands: Command[] = [list, add, done, rm];

const help = createHelpCommand(commands);
commands.push(help);

export const cliService = applyCli(commands);
