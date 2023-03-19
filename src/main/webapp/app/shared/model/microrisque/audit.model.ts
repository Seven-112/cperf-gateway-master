import { Moment } from 'moment';
import { IAuditCycle } from 'app/shared/model/microrisque/audit-cycle.model';
import { AuditRiskLevel } from 'app/shared/model/enumerations/audit-risk-level.model';
import { AuditType } from 'app/shared/model/enumerations/audit-type.model';
import { AuditStatus } from 'app/shared/model/enumerations/audit-status.model';

export interface IAudit {
  id?: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  executedAt?: string;
  processId?: number;
  processName?: string;
  processCategoryId?: number;
  processCategoryName?: string;
  riskLevel?: AuditRiskLevel;
  type?: AuditType;
  status?: AuditStatus;
  riskId?: number;
  riskName?: string;
  cycle?: IAuditCycle;
}

export const defaultValue: Readonly<IAudit> = {};
