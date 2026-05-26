export type DatasetStatus = 'new' | 'profiled' | 'ready' | 'archived' ;

export type MLTaskType = 
    | 'classification'
    | 'regression'
    | 'clustering'
    | 'unknown';

export type ColumnDataType = 
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'category'
    | 'unknown';

export interface DatasetColumn {
    name: string;
    type: ColumnDataType;
    hasMissingValues: boolean;
    uniqueValuesCount?: number;
}

export interface Dataset {
    id: string;
    name: string;
    filePath: string;
    rowCount: number;
    columns: DatasetColumn[];
    status: DatasetStatus;
    taskType: MLTaskType;
    createdAt: Date;
    description?: string;
    targetColumn?: string;
}

export interface DatasetSummary {
    datasetId: string;
    rowsCount: number;
    columnsCount: number;
    hasMissingValues: boolean;
    targetColumn?: string; 
}

export interface DatasetFilter {
    status?: DatasetStatus;
    taskType?: MLTaskType;
}

export type CreateDatasetInput = Omit<Dataset, 'id' | 'createdAt'>

export type UpdateDatasetInput = Partial<
    Omit<Dataset, "id" | "createdAt">
>;

