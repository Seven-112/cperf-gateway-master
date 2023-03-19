import { ITask } from 'app/shared/model/microprocess/task.model';
import { TaskUserRole } from 'app/shared/model/enumerations/task-user-role.model';

export interface ITaskUser {
  id?: number;
  userId?: number;
  role?: TaskUserRole;
  userFullName?: string;
  userEmail?: string;
  task?: ITask;
}

export const defaultValue: Readonly<ITaskUser> = {};
