import { ITask } from 'app/shared/model/microprocess/task.model';
import { TaskFileType } from 'app/shared/model/enumerations/task-file-type.model';

export interface ITaskfile {
  id?: number;
  fileId?: number;
  description?: string;
  type?: TaskFileType;
  task?: ITask;
}

export const defaultValue: Readonly<ITaskfile> = {};
