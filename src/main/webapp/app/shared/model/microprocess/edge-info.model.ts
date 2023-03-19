export interface IEdgeInfo {
  id?: number;
  source?: string;
  target?: string;
  sourceHandle?: string;
  targetHandle?: string;
  processId?: number;
  valid?: boolean;
}

export const defaultValue: Readonly<IEdgeInfo> = {
  valid: false,
};
