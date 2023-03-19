import { ProjectPriority } from 'app/shared/model/enumerations/project-priority.model';

export interface IProject {
  id?: number;
  label?: string;
  description?: any;
  priorityLevel?: ProjectPriority;
  valid?: boolean;
  previewStartAt?: string;
  startAt?: string;
  previewFinishAt?: string;
  finishedAt?: string;
  createdAt?: string;
  startCount?: number;
  parentId?: number;
  editorId?: number;
  runnableProcessId?: number;
  categoryId?: number;
  responsableId?: number;
  responsableName?: string;
  responsableEmail?: string;
  ponderation?: number;
  taskGlobalPonderation?: number;
}

export const defaultValue: Readonly<IProject> = {
  valid: false,
};
