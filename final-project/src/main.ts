import type { Dataset  } from "./types";

const appElement = document.querySelector<HTMLDivElement>("#app");

if (appElement) {
    appElement.textContent = "CDM";
}

export type { Dataset };