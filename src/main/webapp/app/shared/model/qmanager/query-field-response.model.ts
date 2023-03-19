import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';

export interface IQueryFieldResponse {
  id?: number;
  val?: any;
  fieldId?: number;
  instance?: IQueryInstance;
}

export const defaultValue: Readonly<IQueryFieldResponse> = {};
