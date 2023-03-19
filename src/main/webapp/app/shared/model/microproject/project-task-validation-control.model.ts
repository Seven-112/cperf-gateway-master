export interface IProjectTaskValidationControl {
  id?: number;
  label?: string;
  required?: boolean;
  valid?: boolean;
  taskId?: number;
}

export const defaultValue: Readonly<IProjectTaskValidationControl> = {
  required: false,
  valid: false,
};
