#!/usr/bin/env node
// src/index.ts
import { cliService } from "./services/cli";

const argv = process.argv.slice(2);

cliService(...argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
