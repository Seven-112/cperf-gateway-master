import { IProjectTask } from '../microproject/project-task.model';
import { IProject } from '../microproject/project.model';

export interface ITaskProject {
  task?: IProjectTask;
  project?: IProject;
}

export const defaultValue: Readonly<ITaskProject> = {};
