import { Moment } from 'moment';

export interface IPublicHoliday {
  id?: number;
  name?: string;
  ofDate?: string;
}

export const defaultValue: Readonly<IPublicHoliday> = {};
