import { JustifcationReason } from 'app/shared/model/enumerations/justifcation-reason.model';

export interface IJustification {
  id?: number;
  content?: string;
  fileId?: number;
  taskId?: number;
  processId?: number;
  reason?: JustifcationReason;
  accepted?: boolean;
  editorId?: number;
}

export const defaultValue: Readonly<IJustification> = {
  accepted: false,
};
