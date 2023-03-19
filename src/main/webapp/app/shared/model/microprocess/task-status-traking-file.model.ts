import { ITaskStatusTraking } from 'app/shared/model/microprocess/task-status-traking.model';

export interface ITaskStatusTrakingFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  track?: ITaskStatusTraking;
}

export const defaultValue: Readonly<ITaskStatusTrakingFile> = {};
