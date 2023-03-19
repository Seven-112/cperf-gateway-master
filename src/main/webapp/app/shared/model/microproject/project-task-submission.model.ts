import { Moment } from 'moment';

export interface IProjectTaskSubmission {
  id?: number;
  submitorId?: number;
  submitorName?: string;
  submitorEmail?: string;
  comment?: any;
  storeUp?: string;
  taskId?: number;
}

export const defaultValue: Readonly<IProjectTaskSubmission> = {};
