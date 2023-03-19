export interface IAuditStatusTrakingFile {
  id?: number;
  trackId?: number;
  fileId?: number;
  fileName?: string;
}

export const defaultValue: Readonly<IAuditStatusTrakingFile> = {};
