import sampleDataset from "../data/sample-dataset.json";
import { DatasetManager } from "./core/DatasetManager";
import type { CreateDatasetInput, DatasetSummary } from "./types";
import { createDatasetInputFromMetadata, parseDatasetFile } from "./utils/datasetFileParser";

const manager = new DatasetManager();
const sampleDatasetInput = createDatasetInputFromMetadata(sampleDataset as CreateDatasetInput);
const summaryTransitionMs = 260;

let uploadVersion = 0;

export function renderApp(): void {
  const appElement = document.querySelector<HTMLDivElement>("#app");

  if (!appElement) {
    return;
  }

  appElement.innerHTML = createAppMarkup();
  bindUploadControls();
}

function createAppMarkup(): string {
  return `
    <main class="app-page">
      <section class="upload-panel" id="upload-panel" aria-labelledby="upload-title">
        <div class="upload-copy">
          <h1 id="upload-title">Давайте загрузим ваши данные</h1>
        </div>

        <section class="summary" id="summary-section" aria-live="polite">
          <div class="summary-content" id="summary-content">
            <div class="summary__header">
              <span class="summary__label">Профиль датасета</span>
              <strong id="summary-name">-</strong>
            </div>
            <div class="summary-grid" id="summary-grid"></div>
            <div class="column-preview" id="column-preview"></div>
          </div>
        </section>

        <section class="upload-tools" aria-label="Загрузка данных">
          <h2 class="retry-title">Попробуем ещё?</h2>

          <label class="drop-zone" id="drop-zone" for="dataset-file-input">
            <span class="drop-zone__title">Перетащите CSV или JSON файл сюда</span>
            <span class="drop-zone__meta">Тут должно быть описание, текст рыба ыыыыы</span>
          </label>

          <input id="dataset-file-input" class="file-input" type="file" accept=".csv,.json,text/csv,application/json" />

          <div class="actions" aria-label="Действия загрузки">
            <button class="action-button" id="sample-dataset-button" type="button">Загрузить пример</button>
          </div>

          <p class="status-line" id="status-line" role="status">Ожидаю файл</p>
        </section>
      </section>
    </main>
  `;
}

function bindUploadControls(): void {
  const fileInput = document.querySelector<HTMLInputElement>("#dataset-file-input");
  const sampleDatasetButton = document.querySelector<HTMLButtonElement>("#sample-dataset-button");
  const dropZone = document.querySelector<HTMLLabelElement>("#drop-zone");

  sampleDatasetButton?.addEventListener("click", () => {
    const currentUploadVersion = beginUpload();
    void addDataset(sampleDatasetInput, "Пример загружен", currentUploadVersion);
  });

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];

    if (file) {
      void handleFile(file);
      fileInput.value = "";
    }
  });

  dropZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("drop-zone--active");
  });

  dropZone?.addEventListener("dragleave", () => {
    dropZone.classList.remove("drop-zone--active");
  });

  dropZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("drop-zone--active");

    const file = event.dataTransfer?.files[0];

    if (file) {
      void handleFile(file);
    }
  });
}

async function handleFile(file: File): Promise<void> {
  const currentUploadVersion = beginUpload();

  setStatus("Читаю файл...");

  try {
    const input = await parseDatasetFile(file);

    if (currentUploadVersion === uploadVersion) {
      await addDataset(input, "Файл разобран", currentUploadVersion);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось прочитать файл";
    setStatus(message);
  }
}

async function addDataset(
  input: CreateDatasetInput,
  statusMessage: string,
  currentUploadVersion: number,
): Promise<void> {
  const panel = document.querySelector<HTMLElement>("#upload-panel");
  const summaryContent = document.querySelector<HTMLElement>("#summary-content");
  const shouldAnimateUpdate = Boolean(panel?.classList.contains("upload-panel--loaded"));

  if (shouldAnimateUpdate) {
    setStatus("Обновляю сводку...");
    await animateSummaryOut(summaryContent);
  }

  if (currentUploadVersion !== uploadVersion) {
    summaryContent?.classList.remove("summary-content--leaving");
    return;
  }

  const dataset = manager.addDataset(input);
  const summary = manager.getDatasetSummary(dataset.id);

  if (!summary) {
    summaryContent?.classList.remove("summary-content--leaving");
    setStatus("Не удалось собрать сводку");
    return;
  }

  renderSummary(dataset.name, summary);
  renderColumnPreview(input.columns);
  setStatus(statusMessage);
  panel?.classList.add("upload-panel--loaded");

  if (shouldAnimateUpdate) {
    animateSummaryIn(summaryContent);
  }
}

function renderSummary(datasetName: string, summary: DatasetSummary): void {
  const summaryName = document.querySelector<HTMLElement>("#summary-name");
  const summaryGrid = document.querySelector<HTMLElement>("#summary-grid");

  if (!summaryName || !summaryGrid) {
    return;
  }

  summaryName.textContent = datasetName;
  summaryGrid.innerHTML = [
    createMetric("Строк", String(summary.rowsCount)),
    createMetric("Колонок", String(summary.columnsCount)),
    createMetric("Пропуски", summary.hasMissingValues ? "есть" : "нет"),
    createMetric("Цель", summary.targetColumn ?? "не выбрана"),
  ].join("");
}

function renderColumnPreview(columns: CreateDatasetInput["columns"]): void {
  const columnPreview = document.querySelector<HTMLElement>("#column-preview");

  if (!columnPreview) {
    return;
  }

  columnPreview.innerHTML = columns
    .slice(0, 6)
    .map((column) => `<span>${column.name} · ${column.type}</span>`)
    .join("");
}

function createMetric(label: string, value: string): string {
  return `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function setStatus(message: string): void {
  const statusLine = document.querySelector<HTMLElement>("#status-line");

  if (statusLine) {
    statusLine.textContent = message;
  }
}

function beginUpload(): number {
  uploadVersion += 1;
  return uploadVersion;
}

async function animateSummaryOut(summaryContent: HTMLElement | null): Promise<void> {
  if (!summaryContent) {
    return;
  }

  summaryContent.classList.remove("summary-content--entering");
  summaryContent.classList.add("summary-content--leaving");
  await wait(summaryTransitionMs);
}

function animateSummaryIn(summaryContent: HTMLElement | null): void {
  if (!summaryContent) {
    return;
  }

  summaryContent.classList.remove("summary-content--leaving");
  summaryContent.classList.add("summary-content--entering");
  summaryContent.offsetHeight;
  summaryContent.classList.remove("summary-content--entering");
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}
