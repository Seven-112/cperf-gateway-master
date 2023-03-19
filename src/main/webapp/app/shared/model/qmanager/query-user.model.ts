import { IQuery } from 'app/shared/model/qmanager/query.model';

export interface IQueryUser {
  id?: number;
  userId?: number;
  query?: IQuery;
}

export const defaultValue: Readonly<IQueryUser> = {};
