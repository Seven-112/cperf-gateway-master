import { Moment } from 'moment';
import { ProjectTaskStatus } from 'app/shared/model/enumerations/project-task-status.model';
import { ProjectPriority } from 'app/shared/model/enumerations/project-priority.model';
import { ProjectTaskType } from 'app/shared/model/enumerations/project-task-type.model';

export interface IProjectTask {
  id?: number;
  name?: string;
  description?: any;
  nbMinuites?: number;
  nbHours?: number;
  nbDays?: number;
  nbMonths?: number;
  nbYears?: number;
  startAt?: string;
  status?: ProjectTaskStatus;
  priorityLevel?: ProjectPriority;
  type?: ProjectTaskType;
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
  startupTaskId?: number;
  ponderation?: number;
  checked?: boolean;
  createdAt?: string;
}

export const defaultValue: Readonly<IProjectTask> = {
  valid: false,
  startWithProcess: false,
  manualMode: false,
  checked: false,
};
