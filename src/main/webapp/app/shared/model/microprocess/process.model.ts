import { Moment } from 'moment';
import { IProcessCategory } from 'app/shared/model/microprocess/process-category.model';
import { ProcessPriority } from 'app/shared/model/enumerations/process-priority.model';

export interface IProcess {
  id?: number;
  label?: any;
  description?: any;
  priorityLevel?: ProcessPriority;
  canceledAt?: string;
  valid?: boolean;
  previewStartAt?: string;
  startAt?: string;
  previewFinishAt?: string;
  finishedAt?: string;
  createdAt?: string;
  startCount?: number;
  modelId?: number;
  editorId?: number;
  procedureId?: number;
  runnableProcessId?: number;
  queryId?: number;
  category?: IProcessCategory;
}

export const defaultValue: Readonly<IProcess> = {
  valid: false,
};
