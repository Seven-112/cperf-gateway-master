import { TaskStatus } from '../model/enumerations/task-status.model';

export interface IChronoUtil {
  startDate?: string;
  pausedDate?: string;
  prviewFinishDate?: string;
  finishDate?: string;
  status?: TaskStatus;
  execeed?: boolean;
}

export const defaultValue: Readonly<IChronoUtil> = {
  startDate: null,
  pausedDate: null,
  prviewFinishDate: null,
  finishDate: null,
  status: null,
  execeed: false,
};
