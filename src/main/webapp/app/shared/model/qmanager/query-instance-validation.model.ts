import { Moment } from 'moment';
import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { QueryValidationStatus } from 'app/shared/model/enumerations/query-validation-status.model';

export interface IQueryInstanceValidation {
  id?: number;
  validatorId?: number;
  justification?: any;
  validatedAt?: string;
  status?: QueryValidationStatus;
  instance?: IQueryInstance;
}

export const defaultValue: Readonly<IQueryInstanceValidation> = {};
