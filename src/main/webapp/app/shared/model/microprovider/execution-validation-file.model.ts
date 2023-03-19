import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';

export interface IExecutionValidationFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  execution?: ITenderAnswerExecution;
}

export const defaultValue: Readonly<IExecutionValidationFile> = {};
