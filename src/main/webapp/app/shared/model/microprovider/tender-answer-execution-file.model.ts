import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';

export interface ITenderAnswerExecutionFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  execution?: ITenderAnswerExecution;
}

export const defaultValue: Readonly<ITenderAnswerExecutionFile> = {};
