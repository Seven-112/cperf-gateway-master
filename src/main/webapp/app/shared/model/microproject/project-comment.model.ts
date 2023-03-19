export interface IProjectComment {
  id?: number;
  projectId?: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  content?: any;
}

export const defaultValue: Readonly<IProjectComment> = {};
