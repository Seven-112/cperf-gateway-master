export interface IProcessCategoryUser {
  id?: number;
  userId?: number;
  userFullName?: string;
  userEmail?: string;
  categoryId?: number;
  processId?: number;
}

export const defaultValue: Readonly<IProcessCategoryUser> = {};
