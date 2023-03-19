import { Moment } from 'moment';
import { AuditStatus } from 'app/shared/model/enumerations/audit-status.model';

export interface IAuditStatusTraking {
  id?: number;
  auditId?: number;
  status?: AuditStatus;
  tracingAt?: string;
  justification?: any;
  userId?: number;
  editable?: boolean;
  recom?: boolean;
}

export const defaultValue: Readonly<IAuditStatusTraking> = {
  editable: false,
  recom: false,
};
