import { ProjectTaskStatus } from 'app/shared/model/enumerations/project-task-status.model';

export interface IProjectTaskStatusTraking {
  id?: number;
  taskId?: number;
  status?: ProjectTaskStatus;
  tracingAt?: string;
  justification?: any;
  userId?: number;
  userName?: string;
  userEmail?: string;
  editable?: boolean;
}

export const defaultValue: Readonly<IProjectTaskStatusTraking> = {};
