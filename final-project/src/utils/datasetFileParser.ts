import type { ColumnDataType, CreateDatasetInput, DatasetColumn, MLTaskType } from "../types";

type DatasetRecord = Record<string, string>;

const datasetStatuses = ["new", "profiled", "ready", "archived"] as const;
const mlTaskTypes = ["classification", "regression", "clustering", "unknown"] as const;
const columnDataTypes = ["string", "number", "boolean", "date", "category", "unknown"] as const;

export async function parseDatasetFile(file: File): Promise<CreateDatasetInput> {
  const content = await file.text();
  const fileName = file.name;
  const lowerFileName = fileName.toLowerCase();

  if (lowerFileName.endsWith(".csv")) {
    return parseCsvDataset(fileName, content);
  }

  if (lowerFileName.endsWith(".json")) {
    return parseJsonDataset(fileName, content);
  }

  throw new Error("Поддерживаются только CSV и JSON файлы");
}

export function createDatasetInputFromMetadata(input: CreateDatasetInput): CreateDatasetInput {
  return {
    ...input,
    status: input.status ?? "profiled",
    taskType: input.taskType ?? "unknown",
  };
}

function parseCsvDataset(fileName: string, content: string): CreateDatasetInput {
  const rows = parseCsvRows(content);
  const [headers, ...dataRows] = rows;

  if (!headers || headers.length === 0) {
    throw new Error("В CSV не найдена строка с названиями колонок");
  }

  const normalizedHeaders = headers.map((header, index) => header.trim() || `column_${index + 1}`);
  const records = dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => toRecord(normalizedHeaders, row));

  return createDatasetInputFromRecords(fileName, fileName, records);
}

function parseJsonDataset(fileName: string, content: string): CreateDatasetInput {
  const parsed: unknown = JSON.parse(content);

  if (isDatasetInputLike(parsed)) {
    return normalizeDatasetInput(fileName, parsed);
  }

  const records = extractJsonRecords(parsed);

  if (records.length === 0) {
    throw new Error("В JSON не найдены записи для анализа");
  }

  return createDatasetInputFromRecords(fileName, fileName, records);
}

function createDatasetInputFromRecords(
  name: string,
  filePath: string,
  records: DatasetRecord[],
): CreateDatasetInput {
  const headers = collectHeaders(records);
  const columns = headers.map((header) => createColumnDescription(header, records));
  const targetColumn = columns.at(-1)?.name;
  const targetColumnType = columns.at(-1)?.type ?? "unknown";

  return {
    name: removeExtension(name),
    filePath,
    rowCount: records.length,
    columns,
    status: "profiled",
    taskType: inferTaskType(targetColumnType),
    targetColumn,
    description: "Dataset metadata generated from uploaded file",
  };
}

function parseCsvRows(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let isQuoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const nextChar = content[index + 1];

    if (char === '"' && isQuoted && nextChar === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      isQuoted = !isQuoted;
      continue;
    }

    if (char === "," && !isQuoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !isQuoted) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);

  return rows.filter((currentRow) => currentRow.some((value) => value.trim() !== ""));
}

function toRecord(headers: string[], row: string[]): DatasetRecord {
  return headers.reduce<DatasetRecord>((record, header, index) => {
    record[header] = row[index]?.trim() ?? "";
    return record;
  }, {});
}

function extractJsonRecords(value: unknown): DatasetRecord[] {
  if (Array.isArray(value)) {
    return value.filter(isObjectRecord).map(stringifyRecordValues);
  }

  if (isObjectRecord(value) && Array.isArray(value.data)) {
    return value.data.filter(isObjectRecord).map(stringifyRecordValues);
  }

  return [];
}

function normalizeDatasetInput(fileName: string, input: CreateDatasetInput): CreateDatasetInput {
  return {
    name: input.name || removeExtension(fileName),
    filePath: input.filePath || fileName,
    rowCount: Number(input.rowCount) || 0,
    columns: normalizeColumns(input.columns),
    status: isDatasetStatus(input.status) ? input.status : "profiled",
    taskType: isMLTaskType(input.taskType) ? input.taskType : "unknown",
    description: input.description,
    targetColumn: input.targetColumn,
  };
}

function normalizeColumns(columns: DatasetColumn[]): DatasetColumn[] {
  return columns.map((column, index) => ({
    name: column.name || `column_${index + 1}`,
    type: isColumnDataType(column.type) ? column.type : "unknown",
    hasMissingValues: Boolean(column.hasMissingValues),
    uniqueValuesCount: column.uniqueValuesCount,
  }));
}

function createColumnDescription(header: string, records: DatasetRecord[]): DatasetColumn {
  const values = records.map((record) => record[header] ?? "");
  const filledValues = values.filter((value) => value.trim() !== "");

  return {
    name: header,
    type: inferColumnType(filledValues),
    hasMissingValues: filledValues.length !== values.length,
    uniqueValuesCount: new Set(filledValues).size,
  };
}

function inferColumnType(values: string[]): ColumnDataType {
  if (values.length === 0) {
    return "unknown";
  }

  if (values.every(isBooleanString)) {
    return "boolean";
  }

  if (values.every(isNumericString)) {
    return "number";
  }

  if (values.every(isDateString)) {
    return "date";
  }

  const uniqueValuesCount = new Set(values.map((value) => value.toLowerCase())).size;

  if (uniqueValuesCount <= Math.max(12, Math.ceil(values.length * 0.3))) {
    return "category";
  }

  return "string";
}

function inferTaskType(targetColumnType: ColumnDataType): MLTaskType {
  if (targetColumnType === "number") {
    return "regression";
  }

  if (targetColumnType === "category" || targetColumnType === "boolean" || targetColumnType === "string") {
    return "classification";
  }

  return "unknown";
}

function collectHeaders(records: DatasetRecord[]): string[] {
  return Array.from(new Set(records.flatMap((record) => Object.keys(record))));
}

function stringifyRecordValues(record: Record<string, unknown>): DatasetRecord {
  return Object.entries(record).reduce<DatasetRecord>((result, [key, value]) => {
    result[key] = value === null || value === undefined ? "" : String(value);
    return result;
  }, {});
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDatasetInputLike(value: unknown): value is CreateDatasetInput {
  return (
    isObjectRecord(value) &&
    typeof value.name === "string" &&
    typeof value.filePath === "string" &&
    typeof value.rowCount === "number" &&
    Array.isArray(value.columns)
  );
}

function isDatasetStatus(value: unknown): value is CreateDatasetInput["status"] {
  return typeof value === "string" && datasetStatuses.includes(value as CreateDatasetInput["status"]);
}

function isMLTaskType(value: unknown): value is MLTaskType {
  return typeof value === "string" && mlTaskTypes.includes(value as MLTaskType);
}

function isColumnDataType(value: unknown): value is ColumnDataType {
  return typeof value === "string" && columnDataTypes.includes(value as ColumnDataType);
}

function isBooleanString(value: string): boolean {
  return ["true", "false", "1", "0", "yes", "no"].includes(value.toLowerCase());
}

function isNumericString(value: string): boolean {
  return value.trim() !== "" && Number.isFinite(Number(value));
}

function isDateString(value: string): boolean {
  return value.trim() !== "" && Number.isNaN(Number(value)) && Number.isFinite(Date.parse(value));
}

function removeExtension(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "");
}
