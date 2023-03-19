import { Moment } from 'moment';
import { AuditStatus } from 'app/shared/model/enumerations/audit-status.model';

export interface IAuditRecommendation {
  id?: number;
  auditorId?: number;
  auditorName?: string;
  auditorEmail?: string;
  auditId?: number;
  status?: AuditStatus;
  content?: any;
  responsableId?: number;
  responsableName?: string;
  responsableEmail?: string;
  dateLimit?: string;
  editAt?: string;
  executedAt?: string;
  entityId?: number;
  entiyName?: string;
}

export const defaultValue: Readonly<IAuditRecommendation> = {};
