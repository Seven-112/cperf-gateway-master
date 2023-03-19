import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';
import { ITenderDoc } from 'app/shared/model/microprovider/tender-doc.model';

export interface ITenderAnswerDoc {
  id?: number;
  name?: string;
  fileId?: number;
  tenderAnswer?: ITenderAnswer;
  tenderDoc?: ITenderDoc;
}

export const defaultValue: Readonly<ITenderAnswerDoc> = {};
