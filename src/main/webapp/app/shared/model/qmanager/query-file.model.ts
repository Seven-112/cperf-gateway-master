import { IQuery } from 'app/shared/model/qmanager/query.model';

export interface IQueryFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  query?: IQuery;
}

export const defaultValue: Readonly<IQueryFile> = {};
