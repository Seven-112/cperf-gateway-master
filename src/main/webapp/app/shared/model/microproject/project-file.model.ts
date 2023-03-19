import { ProjectFileType } from 'app/shared/model/enumerations/project-file-type.model';

export interface IProjectFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  description?: any;
  fileType?: ProjectFileType;
  projectId?: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
}

export const defaultValue: Readonly<IProjectFile> = {};
