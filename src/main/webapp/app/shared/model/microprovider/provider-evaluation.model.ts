import { Moment } from 'moment';
import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';

export interface IProviderEvaluation {
  id?: number;
  note?: number;
  scale?: number;
  justification?: any;
  userId?: number;
  storeAt?: string;
  updateAt?: string;
  userFullName?: string;
  criteriaId?: number;
  ponderation?: number;
  answer?: ITenderAnswer;
}

export const defaultValue: Readonly<IProviderEvaluation> = {};
