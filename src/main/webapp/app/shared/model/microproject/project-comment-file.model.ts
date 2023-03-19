export interface IProjectCommentFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  commentId?: number;
}

export const defaultValue: Readonly<IProjectCommentFile> = {};
