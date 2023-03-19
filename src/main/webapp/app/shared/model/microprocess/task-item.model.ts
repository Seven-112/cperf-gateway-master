export interface ITaskItem {
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

export const defaultValue: Readonly<ITaskItem> = {
  checked: false,
  required: false,
};
