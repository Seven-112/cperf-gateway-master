import { AuditUserRole } from 'app/shared/model/enumerations/audit-user-role.model';

export interface IAuditUser {
  id?: number;
  auditId?: number;
  userId?: number;
  userFullName?: string;
  userEmail?: string;
  role?: AuditUserRole;
}

export const defaultValue: Readonly<IAuditUser> = {};
