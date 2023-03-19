import { Moment } from 'moment';
import { TaskStatus } from 'app/shared/model/enumerations/task-status.model';
import { ProcessPriority } from 'app/shared/model/enumerations/process-priority.model';
import { TaskType } from 'app/shared/model/enumerations/task-type.model';

export interface ITask {
  id?: number;
  name?: string;
  description?: any;
  nbMinuites?: number;
  nbHours?: number;
  nbDays?: number;
  nbMonths?: number;
  nbYears?: number;
  startAt?: string;
  status?: TaskStatus;
  priorityLevel?: ProcessPriority;
  type?: TaskType;
  valid?: boolean;
  finishAt?: string;
  startWithProcess?: boolean;
  processId?: number;
  parentId?: number;
  taskModelId?: number;
  pauseAt?: string;
  nbPause?: number;
  logigramPosX?: number;
  logigramPosY?: number;
  groupId?: number;
  riskId?: number;
  manualMode?: boolean;
  sheduledStartAt?: string;
  sheduledStartHour?: number;
  sheduledStartMinute?: number;
  checked?: boolean;
  currentPauseHistoryId?: number;
  exceceed?: boolean;
  startupTask?: ITask;
}

export const defaultValue: Readonly<ITask> = {
  valid: false,
  startWithProcess: false,
  manualMode: false,
  checked: false,
  exceceed: false,
};
