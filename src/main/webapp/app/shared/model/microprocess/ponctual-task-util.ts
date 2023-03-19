export interface IProcessPonctualTaskUtil {
  taskId?: number;
  nbMinutes?: number;
  nbHours?: number;
  nbDays?: number;
  nbMonths?: number;
  nbYears?: number;
  instanceId?: number;
}

export const defaultValue: Readonly<IProcessPonctualTaskUtil> = {};
