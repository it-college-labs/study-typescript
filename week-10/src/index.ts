// src/index.ts
import { cliService } from "./services/cli";

const argv = process.argv.slice(2);

cliService(...argv);
