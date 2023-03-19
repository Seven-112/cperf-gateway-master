import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';

export interface ITenderAnswerExecution {
  id?: number;
  userId?: number;
  validated?: boolean;
  comment?: any;
  answer?: ITenderAnswer;
}

export const defaultValue: Readonly<ITenderAnswerExecution> = {
  validated: false,
};
