export interface IPerfIndicator {
  count?: number;
  rate?: number;
  dateMin?: string;
  dateMax?: string;
  countIsAPercent?: boolean;
  avg?: number;
}

export enum PerfIndicatorUnity {
  DAY = 'DAY',
  WEEK = 'WEEK',
  SEMESTER = 'SEMESTER',
  TRIMESTER = 'TRIMESTER',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum StatCategory {
  NO_STARTED_TASK = 'NO_STARTED_TASK',
  RUNNING_TASK = 'RUNNING_TASK',
  EXECUTED_TASK = 'EXECUTED_TASK',
  CANCELED_TASK = 'CANCELED_TASK',
  EXECUTION_LEVEL = 'EXECUTION_LEVEL',
}
