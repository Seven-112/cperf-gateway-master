import { IProviderExecutionAverage } from '../provider-execution-average.model';

export interface IProviderExecutionAverageProjection {
  providerId?: number;
  average?: number;
  executionAverages?: IProviderExecutionAverage[];
}
