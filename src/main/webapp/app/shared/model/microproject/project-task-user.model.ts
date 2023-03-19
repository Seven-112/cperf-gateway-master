import { ProjectTaskUserRole } from 'app/shared/model/enumerations/project-task-user-role.model';

export interface IProjectTaskUser {
  id?: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  role?: ProjectTaskUserRole;
  taskId?: number;
}

export const defaultValue: Readonly<IProjectTaskUser> = {};
