import { ProjectTaskFileType } from 'app/shared/model/enumerations/project-task-file-type.model';

export interface IProjectTaskFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  type?: ProjectTaskFileType;
  taskId?: number;
}

export const defaultValue: Readonly<IProjectTaskFile> = {};
