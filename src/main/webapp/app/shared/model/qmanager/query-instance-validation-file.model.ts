import { IQueryInstanceValidation } from 'app/shared/model/qmanager/query-instance-validation.model';

export interface IQueryInstanceValidationFile {
  id?: number;
  fileName?: string;
  fileId?: number;
  validation?: IQueryInstanceValidation;
}

export const defaultValue: Readonly<IQueryInstanceValidationFile> = {};
