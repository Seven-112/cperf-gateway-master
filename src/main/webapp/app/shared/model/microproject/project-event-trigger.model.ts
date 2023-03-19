import { Moment } from 'moment';
import { ProjectEventRecurrence } from 'app/shared/model/enumerations/project-event-recurrence.model';

export interface IProjectEventTrigger {
  id?: number;
  editorId?: number;
  createdAt?: string;
  name?: string;
  recurrence?: ProjectEventRecurrence;
  disabled?: boolean;
  editorName?: string;
  hour?: number;
  minute?: number;
  firstStartedAt?: string;
  sheduledOn?: string;
  processId?: number;
}

export const defaultValue: Readonly<IProjectEventTrigger> = {
  disabled: false,
};
