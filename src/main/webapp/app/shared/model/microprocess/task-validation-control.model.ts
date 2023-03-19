import { ITask } from 'app/shared/model/microprocess/task.model';

export interface ITaskValidationControl {
  id?: number;
  label?: string;
  required?: boolean;
  valid?: boolean;
  task?: ITask;
}

export const defaultValue: Readonly<ITaskValidationControl> = {
  required: false,
  valid: false,
};
