import { IQueryFieldResponse } from 'app/shared/model/qmanager/query-field-response.model';

export interface IQueryFieldResponseFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  queryFieldResponse?: IQueryFieldResponse;
}

export const defaultValue: Readonly<IQueryFieldResponseFile> = {};
