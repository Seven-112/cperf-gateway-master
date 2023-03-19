import { IProjectTask } from '../model/microproject/project-task.model';
import { IProject } from '../model/microproject/project.model';
import { IChronoUtil } from './chrono-util.model';

export interface ReactFrappeGanttTaskUtil {
  id?: number;
  task?: IProjectTask; // project or task Id
  project?: IProject;
  chronoUtil?: IChronoUtil;
  startDate?: string;
  endDate?: string;
  progress?: number;
  depends?: number[];
  editable?: boolean;
  isProject?: boolean;
}
