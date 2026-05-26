import sampleDataset from "../data/sample-dataset.json";
import { DatasetManager } from "./core/DatasetManager";
import type { CreateDatasetInput } from "./types";

const manager = new DatasetManager();
const datasetInput = sampleDataset as CreateDatasetInput;

function renderDatasetList(): string {
  const datasets = manager.getDatasetList();

  if (datasets.length === 0) {
    return "Датасеты пока не добавлены";
  }

  return datasets
    .map((dataset) => `${dataset.name} — ${dataset.status} — ${dataset.taskType}`)
    .join("\n");
}

export function renderApp(): void {
  const appElement = document.querySelector<HTMLDivElement>("#app");

  if (!appElement) {
    return;
  }

  appElement.innerHTML = `
    <main>
      <h1>CSV Dataset Manager</h1>

      <button id="add-dataset-button">Добавить датасет из JSON</button>
      <button id="show-summary-button">Показать сводку</button>

      <section>
        <h2>Список датасетов</h2>
        <pre id="dataset-list">Датасеты пока не добавлены</pre>
      </section>

      <section>
        <h2>Сводка</h2>
        <pre id="dataset-summary">Сводка пока не сформирована</pre>
      </section>
    </main>
  `;

  const addButton = document.querySelector<HTMLButtonElement>("#add-dataset-button");
  const summaryButton = document.querySelector<HTMLButtonElement>("#show-summary-button");
  const listElement = document.querySelector<HTMLPreElement>("#dataset-list");
  const summaryElement = document.querySelector<HTMLPreElement>("#dataset-summary");

  addButton?.addEventListener("click", () => {
    manager.addDataset(datasetInput);

    if (listElement) {
      listElement.textContent = renderDatasetList();
    }
  });

  summaryButton?.addEventListener("click", () => {
    const firstDataset = manager.getAllDatasets()[0];

    if (!firstDataset || !summaryElement) {
      return;
    }

    const summary = manager.getDatasetSummary(firstDataset.id);

    if (!summary) {
      return;
    }

    summaryElement.textContent = [
      `Строк: ${summary.rowsCount}`,
      `Колонок: ${summary.columnsCount}`,
      `Пропуски: ${summary.hasMissingValues ? "есть" : "нет"}`,
      `Целевая колонка: ${summary.targetColumn ?? "не выбрана"}`,
    ].join("\n");
  });
}