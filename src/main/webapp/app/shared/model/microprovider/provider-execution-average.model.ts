import { Moment } from 'moment';
import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';

export interface IProviderExecutionAverage {
  id?: number;
  providerId?: number;
  average?: number;
  dte?: string;
  answer?: ITenderAnswer;
}

export const defaultValue: Readonly<IProviderExecutionAverage> = {};
