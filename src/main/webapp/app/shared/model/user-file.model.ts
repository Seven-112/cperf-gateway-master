export interface IUserFile {
  id?: number;
  userId?: number;
  fileId?: number;
  fileName?: string;
  parentId?: number;
  isFolder?: boolean;
  isEmploye?: boolean;
}

export const defaultValue: Readonly<IUserFile> = {
  isFolder: false,
  isEmploye: false,
};
