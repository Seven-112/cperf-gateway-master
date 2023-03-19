import { Moment } from 'moment';

export interface IProjectCalendar {
  id?: number;
  dayNumber?: number;
  startTime?: string;
  endTime?: string;
  projectId?: number;
}

export const defaultValue: Readonly<IProjectCalendar> = {};
