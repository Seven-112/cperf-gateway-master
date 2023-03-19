export interface IProjectTaskItem {
  id?: number;
  name?: string;
  taskId?: number;
  checked?: boolean;
  checkerId?: number;
  checkerName?: string;
  checkerEmail?: string;
  editorId?: number;
  editorEmail?: string;
  editorName?: string;
  required?: boolean;
}

export const defaultValue: Readonly<IProjectTaskItem> = {
  checked: false,
  required: false,
};
