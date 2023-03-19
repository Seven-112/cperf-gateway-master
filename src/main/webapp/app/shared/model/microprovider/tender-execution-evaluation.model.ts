import { Moment } from 'moment';
import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';

export interface ITenderExecutionEvaluation {
  id?: number;
  note?: number;
  scale?: number;
  justification?: any;
  userId?: number;
  userFullName?: string;
  storeAt?: string;
  updateAt?: string;
  ponderation?: number;
  execution?: ITenderAnswerExecution;
}

export const defaultValue: Readonly<ITenderExecutionEvaluation> = {};
