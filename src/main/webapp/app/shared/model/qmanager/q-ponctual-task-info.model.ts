export interface IQPonctualTaskInfo {
  id?: number;
  nbMinutes?: number;
  nbHours?: number;
  nbDays?: number;
  nbMonths?: number;
  nbYears?: number;
  qInstanceId?: number;
}

export const defaultValue: Readonly<IQPonctualTaskInfo> = {};
