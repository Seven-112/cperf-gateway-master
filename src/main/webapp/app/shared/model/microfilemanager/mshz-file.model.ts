import { Moment } from 'moment';

export interface IMshzFile {
  id?: number;
  name?: string;
  fDataContentType?: string;
  fData?: any;
  entityId?: number;
  entityTagName?: string;
  userId?: number;
  storeAt?: string;
}

export const defaultValue: Readonly<IMshzFile> = {};
