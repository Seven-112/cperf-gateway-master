import { Moment } from 'moment';

export interface IProjectPublicHoliday {
  id?: number;
  name?: string;
  date?: string;
  levelId?: number;
  processId?: number;
}

export const defaultValue: Readonly<IProjectPublicHoliday> = {};
