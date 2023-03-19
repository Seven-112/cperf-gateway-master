import { AuditUserRole } from 'app/shared/model/enumerations/audit-user-role.model';

export interface IAuditRecomUser {
  id?: number;
  recomId?: number;
  userId?: number;
  userFullName?: string;
  userEmail?: string;
  role?: AuditUserRole;
}

export const defaultValue: Readonly<IAuditRecomUser> = {};
