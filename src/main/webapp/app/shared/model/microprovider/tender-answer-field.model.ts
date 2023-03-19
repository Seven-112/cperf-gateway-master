import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';

export interface ITenderAnswerField {
  id?: number;
  val?: any;
  fileId?: number;
  fileName?: string;
  fieldId?: number;
  answer?: ITenderAnswer;
}

export const defaultValue: Readonly<ITenderAnswerField> = {};
