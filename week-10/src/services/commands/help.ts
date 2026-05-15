// src/services/commands/help.ts

// Эта команда не совсем обычная, поэтому ее код
//   (в том числе и для примера)
//   приведен целиком
// Остальные команды не должны экспортировать create<...>Command,
//   они должны экспортировать готовую команду

import { type Command } from "../types";

export const createHelpCommand = (commands: Command[]): Command => {
  return {
    accept(...argv: string[]) {
      const [name] = argv;
      return argv.length === 1 && ["h", "help"].includes(name);
    },
    run() {
      console.log(
        [
          "*** Commands list ***",
          ...commands
            .filter((c) => Boolean(c.description))
            .map((c) => " * " + c.description),
        ].join("\n"),
      );
      return false;
    },
    description: null,
  };
};
