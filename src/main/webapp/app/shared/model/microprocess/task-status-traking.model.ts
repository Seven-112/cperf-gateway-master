import { Moment } from 'moment';
import { TaskStatus } from 'app/shared/model/enumerations/task-status.model';

export interface ITaskStatusTraking {
  id?: number;
  taskId?: number;
  status?: TaskStatus;
  tracingAt?: string;
  justification?: any;
  userId?: number;
  editable?: boolean;
  execeed?: boolean;
  perfIndicator?: boolean;
}

export const defaultValue: Readonly<ITaskStatusTraking> = {
  editable: false,
  execeed: false,
  perfIndicator: false,
};
