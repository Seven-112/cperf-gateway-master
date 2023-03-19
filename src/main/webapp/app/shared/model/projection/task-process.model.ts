import { IProcess } from '../microprocess/process.model';
import { ITask } from '../microprocess/task.model';

export interface ITaskProcess {
  task?: ITask;
  process?: IProcess;
}

export const defaultValue: Readonly<ITaskProcess> = {};
