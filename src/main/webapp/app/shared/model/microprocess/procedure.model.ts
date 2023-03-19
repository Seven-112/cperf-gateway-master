import { Moment } from 'moment';

export interface IProcedure {
  id?: number;
  name?: string;
  fileId?: number;
  storeAt?: string;
}

export const defaultValue: Readonly<IProcedure> = {};
