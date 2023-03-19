import { Moment } from 'moment';
import { IAudit } from 'app/shared/model/microrisque/audit.model';
import { AuditEventRecurrence } from 'app/shared/model/enumerations/audit-event-recurrence.model';

export interface IAuditEventTrigger {
  id?: number;
  editorId?: number;
  createdAt?: string;
  name?: string;
  recurrence?: AuditEventRecurrence;
  disabled?: boolean;
  editorName?: string;
  firstStartedAt?: string;
  nextStartAt?: string;
  startCount?: number;
  audit?: IAudit;
}

export const defaultValue: Readonly<IAuditEventTrigger> = {
  disabled: false,
};
