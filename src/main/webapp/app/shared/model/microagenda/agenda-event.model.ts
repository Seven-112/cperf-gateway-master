import { Moment } from 'moment';
import { EventRecurrence } from 'app/shared/model/enumerations/event-recurrence.model';
import { EventReminderUnity } from 'app/shared/model/enumerations/event-reminder-unity.model';

export interface IAgendaEvent {
  id?: number;
  title?: string;
  description?: any;
  location?: string;
  startAt?: string;
  endAt?: string;
  timeZone?: string;
  editorId?: number;
  editorName?: string;
  createdAt?: string;
  recurrence?: EventRecurrence;
  reminderValue?: number;
  reminderUnity?: EventReminderUnity;
  editorEmail?: string;
  valid?: boolean;
  nextReminderAt?: string;
  nextOccurenceStartAt?: string;
  nextOccurenceEndAt?: string;
  langKey?: string;
  startHour?: number;
  dayOfWeek?: number;
  month?: number;
  dateOfMonth?: number;
  startYear?: number;
  parent?: IAgendaEvent;
}

export const defaultValue: Readonly<IAgendaEvent> = {
  valid: false,
};
