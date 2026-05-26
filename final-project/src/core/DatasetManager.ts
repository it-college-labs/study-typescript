import type { CreateDatasetInput, Dataset, DatasetFilter, DatasetSummary, UpdateDatasetInput } from "../types";

export class DatasetManager {
  private datasets: Dataset[] = [];

  addDataset(input: CreateDatasetInput): Dataset {
    const dataset: Dataset = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    this.datasets.push(dataset);

    return dataset;
  }

  removeDataset(id: string): boolean {
    const initialLength = this.datasets.length;

    this.datasets = this.datasets.filter((dataset) => dataset.id !== id);

    return this.datasets.length < initialLength;
  }

  updateDataset(id: string, updates: UpdateDatasetInput): Dataset | null { 
    const dataset = this.datasets.find((dataset) => dataset.id === id);

    if(!dataset) {
        return null;
    }

    Object.assign(dataset, updates);

    return dataset;
  }

  filterDatasets(filter: DatasetFilter): Dataset[] {
    return this.datasets.filter((dataset) => {
        const matchesStatus = filter.status === undefined || dataset.status === filter.status;
        const matchesTaskType = filter.taskType === undefined || dataset.taskType === filter.taskType;

        return matchesStatus && matchesTaskType;
    });
  }

  getDatasetSummary(id: string): DatasetSummary | null {
    const dataset = this.datasets.find((dataset) => dataset.id === id);

    if (!dataset) {
        return null;
    }

    return {
        datasetId: dataset.id,
        rowsCount: dataset.rowCount,
        columnsCount: dataset.columns.length,
        hasMissingValues: dataset.columns.some((column) => column.hasMissingValues),
        targetColumn: dataset.targetColumn
    }
  }

  getAllDatasets(): Dataset[] {
    return this.datasets;
  }
}