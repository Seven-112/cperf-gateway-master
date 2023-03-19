import { Moment } from 'moment';

export interface IWorkCalender {
  id?: number;
  dayNumber?: number;
  startTime?: string;
  endTime?: string;
}

export const defaultValue: Readonly<IWorkCalender> = {};
