export interface IFileChunkMetadata {
  name?: string;
  chunk?: number;
  chunks?: number;
  entityId?: number;
  entityTagName?: string;
  userId?: number;
}

export enum FileEntityTag {
  // gateway tagds
  userFile = 'USER_FILE',
  userFolderFile = 'USER_FILE_IN_FOLDER',
  dynamicFiled = 'DYNAMIC_FIELD',
  dynamicFiledDescFile = 'DYNAMIC_FIELD_DESC_FILE',

  // process tags
  procedure = 'PROCEDURE',
  processTaskFileDescription = 'PROCESS_TASKFILE_DESCRIPTION',
  processTaskFileSubmition = 'PROCESS_TASKFILE_SUBMISSION',
  processTaskFileValidation = 'PROCESS_TASKFILE_VALIDATION',
  processCheckItemJustification = 'PROCESS_CHECK_ITEM_JUSTIFICATION',
  processTaskStatusTraking = 'PROCESS_TASK_STATUS_TRAKING',

  // projects tags
  projectTaskFileDescription = 'PROJECT_TASKFILE_DESCRIPTION',
  projectTaskFileSubmition = 'PROJECT_TASKFILE_SUBMISSION',
  projectTaskFileValidation = 'PROJECT_TASKFILE_VALIDATION',
  projectComment = 'PROJECT_COMMENT',
  projectCheckItemJustification = 'PROJECT_CHECK_ITEM_JUSTIFICATION',
  projectTaskStatusTraking = 'PROJECT_TASK_STATUS_TRAKING',

  // audit and recommandation tags
  auditRecom = 'AUDIT_RECOMMANDATION',
  auditStatusTraking = 'AUDIT_STATUS_TRAKING',

  // query tags
  query = 'QUERY',
  queryInstanceValidation = 'QUERY_INSTANCE_VALIDATION',

  // agenda tags
  agendaEvent = 'AGENDA_EVENT',

  // tender tags
  tender = 'TENDER',
  tenderPartenerField = 'TENDER_PARTENER_FIELD',
  tenderPartener = 'TENDER_PARTENER',
  tenderAnswerExecution = 'TENDER_ANSWER_EXECUTION',
  tenderAnswerDoc = 'TENDER_ANSWER_DOC',

  // stock tags
  stockChangement = 'STOCK_CHANGEMENT',
}
