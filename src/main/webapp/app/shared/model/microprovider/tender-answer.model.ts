import { Moment } from 'moment';
import { ITender } from 'app/shared/model/microprovider/tender.model';
import { DeleyUnity } from 'app/shared/model/enumerations/deley-unity.model';

export interface ITenderAnswer {
  id?: number;
  storeAt?: string;
  content?: any;
  providerId?: number;
  executionDeley?: number;
  executionDeleyUnity?: DeleyUnity;
  average?: number;
  startedAt?: string;
  starterId?: number;
  finishedAt?: string;
  finisherId?: number;
  executionAverage?: number;
  confirmSelectMailSent?: boolean;
  tender?: ITender;
}

export const defaultValue: Readonly<ITenderAnswer> = {
  confirmSelectMailSent: false,
};
