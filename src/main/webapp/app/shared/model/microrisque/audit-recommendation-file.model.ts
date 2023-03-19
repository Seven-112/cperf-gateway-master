export interface IAuditRecommendationFile {
  id?: number;
  recommendationId?: number;
  fileId?: number;
  fileName?: string;
}

export const defaultValue: Readonly<IAuditRecommendationFile> = {};
