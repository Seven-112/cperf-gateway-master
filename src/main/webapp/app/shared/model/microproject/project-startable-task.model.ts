import { Moment } from 'moment';
import { ProjectStartableTaskCond } from 'app/shared/model/enumerations/project-startable-task-cond.model';

export interface IProjectStartableTask {
  id?: number;
  triggerTaskId?: number;
  startableTaskId?: number;
  triggerTaskName?: string;
  startableTaskName?: string;
  triggerProjectName?: string;
  startableProjectName?: string;
  userId?: number;
  createdAt?: string;
  startCond?: ProjectStartableTaskCond;
}

export const defaultValue: Readonly<IProjectStartableTask> = {};
