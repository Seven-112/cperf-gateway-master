import { QPeriodUnity } from 'app/shared/model/enumerations/q-period-unity.model';

export interface IQueryUserValidator {
  id?: number;
  validatorId?: number;
  previewValidatorId?: number;
  validationDeleyLimit?: number;
  validationDeleyLimitUnity?: QPeriodUnity;
  userId?: number;
  queryId?: number;
}

export const defaultValue: Readonly<IQueryUserValidator> = {};
