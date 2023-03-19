import { Moment } from 'moment';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { ProcessEventRecurrence } from 'app/shared/model/enumerations/process-event-recurrence.model';

export interface IEventTrigger {
  id?: number;
  editorId?: number;
  createdAt?: string;
  name?: string;
  recurrence?: ProcessEventRecurrence;
  disabled?: boolean;
  editorName?: string;
  firstStartedAt?: string;
  nextStartAt?: string;
  startCount?: number;
  process?: IProcess;
}

export const defaultValue: Readonly<IEventTrigger> = {
  disabled: false,
};
