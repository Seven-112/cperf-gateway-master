import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';

export interface IExecutionValidation {
  id?: number;
  userId?: number;
  approved?: boolean;
  justification?: any;
  execution?: ITenderAnswerExecution;
}

export const defaultValue: Readonly<IExecutionValidation> = {
  approved: false,
};
