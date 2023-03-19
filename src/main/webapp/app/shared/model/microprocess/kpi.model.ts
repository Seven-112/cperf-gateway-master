import { Moment } from 'moment';

export interface IKPI {
  id?: number;
  userId?: number;
  dte?: string;
  executed?: number;
  executedRate?: number;
  executedLate?: number;
  executedLateRate?: number;
  totalExecuted?: number;
  totalExecutedRate?: number;
  started?: number;
  startedRate?: number;
  startedLate?: number;
  startedLateRate?: number;
  totalStarted?: number;
  totalStartedRate?: number;
  noStarted?: number;
  noStartedRate?: number;
  executionLevel?: number;
  executionLevelRate?: number;
}

export const defaultValue: Readonly<IKPI> = {};
