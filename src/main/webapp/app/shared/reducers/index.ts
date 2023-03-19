import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
import drawer, { DrawerState } from './drawer';
import fileUpload, { FileUploadState } from './file-upload-reducer';
import appUtils, { AppUtilsState } from './app-util';
// prettier-ignore
import mshzFile, {
  MshzFileState
} from 'app/entities/microfilemanager/mshz-file/mshz-file.reducer';
// prettier-ignore
import process, {
  ProcessState
} from 'app/entities/microprocess/process/process.reducer';
// prettier-ignore
import task, {
  TaskState
} from 'app/entities/microprocess/task/task.reducer';
// prettier-ignore
import employee, {
  EmployeeState
} from 'app/entities/employee/employee.reducer';
// prettier-ignore
import department, {
  DepartmentState
} from 'app/entities/department/department.reducer';
// prettier-ignore
import condNode, {
  CondNodeState
} from 'app/entities/microprocess/cond-node/cond-node.reducer';
// prettier-ignore
import edgeInfo, {
  EdgeInfoState
} from 'app/entities/microprocess/edge-info/edge-info.reducer';
// prettier-ignore
import workCalender, {
  WorkCalenderState
} from 'app/entities/work-calender/work-calender.reducer';
// prettier-ignore
import publicHoliday, {
  PublicHolidayState
} from 'app/entities/public-holiday/public-holiday.reducer';
// prettier-ignore
import justification, {
  JustificationState
} from 'app/entities/microprocess/justification/justification.reducer';
// prettier-ignore
import userExtra, {
  UserExtraState
} from 'app/entities/user-extra/user-extra.reducer';
// prettier-ignore
import procedure, {
  ProcedureState
} from 'app/entities/microprocess/procedure/procedure.reducer';
// prettier-ignore
import typeObjectif, {
  TypeObjectifState
} from 'app/entities/type-objectif/type-objectif.reducer';
// prettier-ignore
import typeindicator, {
  TypeindicatorState
} from 'app/entities/typeindicator/typeindicator.reducer';
// prettier-ignore
import fonction, {
  FonctionState
} from 'app/entities/fonction/fonction.reducer';
// prettier-ignore
import objectif, {
  ObjectifState
} from 'app/entities/objectif/objectif.reducer';
// prettier-ignore
import indicator, {
  IndicatorState
} from 'app/entities/indicator/indicator.reducer';
// prettier-ignore
import modelEntity, {
  ModelEntityState
} from 'app/entities/model-entity/model-entity.reducer';
// prettier-ignore
import privilege, {
  PrivilegeState
} from 'app/entities/privilege/privilege.reducer';
// prettier-ignore
import taskfile, {
  TaskfileState
} from 'app/entities/microprocess/taskfile/taskfile.reducer';
// prettier-ignore
import taskUser, {
  TaskUserState
} from 'app/entities/microprocess/task-user/task-user.reducer';
// prettier-ignore
import taskValidationControl, {
  TaskValidationControlState
} from 'app/entities/microprocess/task-validation-control/task-validation-control.reducer';
// prettier-ignore
import risk, {
  RiskState
} from 'app/entities/microrisque/risk/risk.reducer';
// prettier-ignore
import riskType, {
  RiskTypeState
} from 'app/entities/microrisque/risk-type/risk-type.reducer';
// prettier-ignore
import controlType, {
  ControlTypeState
} from 'app/entities/microrisque/control-type/control-type.reducer';
// prettier-ignore
import controlMaturity, {
  ControlMaturityState
} from 'app/entities/microrisque/control-maturity/control-maturity.reducer';
// prettier-ignore
import control, {
  ControlState
} from 'app/entities/microrisque/control/control.reducer';
// prettier-ignore
import notification, {
  NotificationState
} from 'app/entities/notification/notification.reducer';
// prettier-ignore
import partenerCategory, {
  PartenerCategoryState
} from 'app/entities/micropartener/partener-category/partener-category.reducer';
// prettier-ignore
import field, {
  FieldState
} from 'app/entities/micropartener/field/field.reducer';
// prettier-ignore
import partener, {
  PartenerState
} from 'app/entities/micropartener/partener/partener.reducer';
// prettier-ignore
import partenerField, {
  PartenerFieldState
} from 'app/entities/micropartener/partener-field/partener-field.reducer';
// prettier-ignore
import tender, {
  TenderState
} from 'app/entities/microprovider/tender/tender.reducer';
// prettier-ignore
import tenderDoc, {
  TenderDocState
} from 'app/entities/microprovider/tender-doc/tender-doc.reducer';
// prettier-ignore
import tenderAnswer, {
  TenderAnswerState
} from 'app/entities/microprovider/tender-answer/tender-answer.reducer';
// prettier-ignore
import tenderFile, {
  TenderFileState
} from 'app/entities/microprovider/tender-file/tender-file.reducer';
// prettier-ignore
import tenderAnswerDoc, {
  TenderAnswerDocState
} from 'app/entities/microprovider/tender-answer-doc/tender-answer-doc.reducer';
// prettier-ignore
import evaluationCriteria, {
  EvaluationCriteriaState
} from 'app/entities/micropartener/evaluation-criteria/evaluation-criteria.reducer';
// prettier-ignore
import partenerCategoryEvaluator, {
  PartenerCategoryEvaluatorState
} from 'app/entities/micropartener/partener-category-evaluator/partener-category-evaluator.reducer';
// prettier-ignore
import providerEvaluation, {
  ProviderEvaluationState
} from 'app/entities/microprovider/provider-evaluation/provider-evaluation.reducer';
// prettier-ignore
import partenerCategoryValidator, {
  PartenerCategoryValidatorState
} from 'app/entities/micropartener/partener-category-validator/partener-category-validator.reducer';
// prettier-ignore
import tenderProviderSelection, {
  TenderProviderSelectionState
} from 'app/entities/microprovider/tender-provider-selection/tender-provider-selection.reducer';
// prettier-ignore
import tenderProviderSelectionValidation, {
  TenderProviderSelectionValidationState
} from 'app/entities/microprovider/tender-provider-selection-validation/tender-provider-selection-validation.reducer';
// prettier-ignore
import tenderAnswerExecution, {
  TenderAnswerExecutionState
} from 'app/entities/microprovider/tender-answer-execution/tender-answer-execution.reducer';
// prettier-ignore
import executionValidation, {
  ExecutionValidationState
} from 'app/entities/microprovider/execution-validation/execution-validation.reducer';
// prettier-ignore
import executionValidationFile, {
  ExecutionValidationFileState
} from 'app/entities/microprovider/execution-validation-file/execution-validation-file.reducer';
// prettier-ignore
import tenderAnswerExecutionFile, {
  TenderAnswerExecutionFileState
} from 'app/entities/microprovider/tender-answer-execution-file/tender-answer-execution-file.reducer';
// prettier-ignore
import tenderExecutionEvaluation, {
  TenderExecutionEvaluationState
} from 'app/entities/microprovider/tender-execution-evaluation/tender-execution-evaluation.reducer';
// prettier-ignore
import partenerFieldFile, {
  PartenerFieldFileState
} from 'app/entities/micropartener/partener-field-file/partener-field-file.reducer';
// prettier-ignore
import providerExpedition, {
  ProviderExpeditionState
} from 'app/entities/microprovider/provider-expedition/provider-expedition.reducer';
// prettier-ignore
import dynamicField, {
  DynamicFieldState
} from 'app/entities/dynamic-field/dynamic-field.reducer';
// prettier-ignore
import tenderAnswerField, {
  TenderAnswerFieldState
} from 'app/entities/microprovider/tender-answer-field/tender-answer-field.reducer';
// prettier-ignore
import providerExecutionAverage, {
  ProviderExecutionAverageState
} from 'app/entities/microprovider/provider-execution-average/provider-execution-average.reducer';
// prettier-ignore
import taskStatusTraking, {
  TaskStatusTrakingState
} from 'app/entities/microprocess/task-status-traking/task-status-traking.reducer';
// prettier-ignore
import taskStatusTrakingFile, {
  TaskStatusTrakingFileState
} from 'app/entities/microprocess/task-status-traking-file/task-status-traking-file.reducer';
// prettier-ignore
import processCategory, {
  ProcessCategoryState
} from 'app/entities/microprocess/process-category/process-category.reducer';
// prettier-ignore
import query, {
  QueryState
} from 'app/entities/qmanager/query/query.reducer';
// prettier-ignore
import queryUser, {
  QueryUserState
} from 'app/entities/qmanager/query-user/query-user.reducer';
// prettier-ignore
import queryField, {
  QueryFieldState
} from 'app/entities/qmanager/query-field/query-field.reducer';
// prettier-ignore
import queryFieldResponse, {
  QueryFieldResponseState
} from 'app/entities/qmanager/query-field-response/query-field-response.reducer';
// prettier-ignore
import queryFieldResponseFile, {
  QueryFieldResponseFileState
} from 'app/entities/qmanager/query-field-response-file/query-field-response-file.reducer';
// prettier-ignore
import queryUserValidator, {
  QueryUserValidatorState
} from 'app/entities/qmanager/query-user-validator/query-user-validator.reducer';
// prettier-ignore
import queryClientType, {
  QueryClientTypeState
} from 'app/entities/qmanager/query-client-type/query-client-type.reducer';
// prettier-ignore
import queryClient, {
  QueryClientState
} from 'app/entities/qmanager/query-client/query-client.reducer';
// prettier-ignore
import qCategory, {
  QCategoryState
} from 'app/entities/qmanager/q-category/q-category.reducer';
// prettier-ignore
import queryFile, {
  QueryFileState
} from 'app/entities/qmanager/query-file/query-file.reducer';
// prettier-ignore
import queryInstance, {
  QueryInstanceState
} from 'app/entities/qmanager/query-instance/query-instance.reducer';
// prettier-ignore
import queryInstanceValidation, {
  QueryInstanceValidationState
} from 'app/entities/qmanager/query-instance-validation/query-instance-validation.reducer';
// prettier-ignore
import queryInstanceValidationFile, {
  QueryInstanceValidationFileState
} from 'app/entities/qmanager/query-instance-validation-file/query-instance-validation-file.reducer';
// prettier-ignore
import agendaEvent, {
  AgendaEventState
} from 'app/entities/microagenda/agenda-event/agenda-event.reducer';
// prettier-ignore
import eventFile, {
  EventFileState
} from 'app/entities/microagenda/event-file/event-file.reducer';
// prettier-ignore
import eventParticipant, {
  EventParticipantState
} from 'app/entities/microagenda/event-participant/event-participant.reducer';
// prettier-ignore
import eventExeption, {
  EventExeptionState
} from 'app/entities/microagenda/event-exeption/event-exeption.reducer';
// prettier-ignore
import eventTrigger, {
  EventTriggerState
} from 'app/entities/microprocess/event-trigger/event-trigger.reducer';
// prettier-ignore
import taskItem, {
  TaskItemState
} from 'app/entities/microprocess/task-item/task-item.reducer';
// prettier-ignore
import itemCheckJustificationFile, {
  ItemCheckJustificationFileState
} from 'app/entities/microprocess/item-check-justification-file/item-check-justification-file.reducer';
// prettier-ignore
import itemCheckJustification, {
  ItemCheckJustificationState
} from 'app/entities/microprocess/item-check-justification/item-check-justification.reducer';
// prettier-ignore
import projectEdgeInfo, {
  ProjectEdgeInfoState
} from 'app/entities/microproject/project-edge-info/project-edge-info.reducer';
// prettier-ignore
import projectEventTrigger, {
  ProjectEventTriggerState
} from 'app/entities/microproject/project-event-trigger/project-event-trigger.reducer';
// prettier-ignore
import projectItemCheckJustification, {
  ProjectItemCheckJustificationState
} from 'app/entities/microproject/project-item-check-justification/project-item-check-justification.reducer';
// prettier-ignore
import projectItemCheckJustificationFile, {
  ProjectItemCheckJustificationFileState
} from 'app/entities/microproject/project-item-check-justification-file/project-item-check-justification-file.reducer';
// prettier-ignore
import projectPublicHoliday, {
  ProjectPublicHolidayState
} from 'app/entities/microproject/project-public-holiday/project-public-holiday.reducer';
// prettier-ignore
import projectTask, {
  ProjectTaskState
} from 'app/entities/microproject/project-task/project-task.reducer';
// prettier-ignore
import projectTaskFile, {
  ProjectTaskFileState
} from 'app/entities/microproject/project-task-file/project-task-file.reducer';
// prettier-ignore
import projectTaskItem, {
  ProjectTaskItemState
} from 'app/entities/microproject/project-task-item/project-task-item.reducer';
// prettier-ignore
import projectTaskStatusTraking, {
  ProjectTaskStatusTrakingState
} from 'app/entities/microproject/project-task-status-traking/project-task-status-traking.reducer';
// prettier-ignore
import projectTaskStatusTrakingFile, {
  ProjectTaskStatusTrakingFileState
} from 'app/entities/microproject/project-task-status-traking-file/project-task-status-traking-file.reducer';
// prettier-ignore
import projectTaskSubmission, {
  ProjectTaskSubmissionState
} from 'app/entities/microproject/project-task-submission/project-task-submission.reducer';
// prettier-ignore
import projectTaskUser, {
  ProjectTaskUserState
} from 'app/entities/microproject/project-task-user/project-task-user.reducer';
// prettier-ignore
import projectTaskValidationControl, {
  ProjectTaskValidationControlState
} from 'app/entities/microproject/project-task-validation-control/project-task-validation-control.reducer';
// prettier-ignore
import project, {
  ProjectState
} from 'app/entities/microproject/project/project.reducer';
// prettier-ignore
import projectCategory, {
  ProjectCategoryState
} from 'app/entities/microproject/project-category/project-category.reducer';
// prettier-ignore
import projectCalendar, {
  ProjectCalendarState
} from 'app/entities/microproject/project-calendar/project-calendar.reducer';
// prettier-ignore
import projectCondNode, {
  ProjectCondNodeState
} from 'app/entities/microproject/project-cond-node/project-cond-node.reducer';
// prettier-ignore
import projectFile, {
  ProjectFileState
} from 'app/entities/microproject/project-file/project-file.reducer';
// prettier-ignore
import projectComment, {
  ProjectCommentState
} from 'app/entities/microproject/project-comment/project-comment.reducer';
// prettier-ignore
import projectCommentFile, {
  ProjectCommentFileState
} from 'app/entities/microproject/project-comment-file/project-comment-file.reducer';
// prettier-ignore
import tenderProvider, {
  TenderProviderState
} from 'app/entities/microprovider/tender-provider/tender-provider.reducer';
// prettier-ignore
import equipement, {
  EquipementState
} from 'app/entities/microstock/equipement/equipement.reducer';
// prettier-ignore
import engeneering, {
  EngeneeringState
} from 'app/entities/microstock/engeneering/engeneering.reducer';
// prettier-ignore
import consommable, {
  ConsommableState
} from 'app/entities/microstock/consommable/consommable.reducer';
// prettier-ignore
import changement, {
  ChangementState
} from 'app/entities/microstock/changement/changement.reducer';
// prettier-ignore
import approvisionnement, {
  ApprovisionnementState
} from 'app/entities/microstock/approvisionnement/approvisionnement.reducer';
// prettier-ignore
import processCategoryUser, {
  ProcessCategoryUserState
} from 'app/entities/microprocess/process-category-user/process-category-user.reducer';
// prettier-ignore
import userFile, {
  UserFileState
} from 'app/entities/user-file/user-file.reducer';
// prettier-ignore
import audit, {
  AuditState
} from 'app/entities/microrisque/audit/audit.reducer';
// prettier-ignore
import auditUser, {
  AuditUserState
} from 'app/entities/microrisque/audit-user/audit-user.reducer';
// prettier-ignore
import auditStatusTraking, {
  AuditStatusTrakingState
} from 'app/entities/microrisque/audit-status-traking/audit-status-traking.reducer';
// prettier-ignore
import auditStatusTrakingFile, {
  AuditStatusTrakingFileState
} from 'app/entities/microrisque/audit-status-traking-file/audit-status-traking-file.reducer';
// prettier-ignore
import auditRecommendationFile, {
  AuditRecommendationFileState
} from 'app/entities/microrisque/audit-recommendation-file/audit-recommendation-file.reducer';
// prettier-ignore
import auditRecommendation, {
  AuditRecommendationState
} from 'app/entities/microrisque/audit-recommendation/audit-recommendation.reducer';
// prettier-ignore
import auditCycle, {
  AuditCycleState
} from 'app/entities/microrisque/audit-cycle/audit-cycle.reducer';
// prettier-ignore
import auditRecomUser, {
  AuditRecomUserState
} from 'app/entities/microrisque/audit-recom-user/audit-recom-user.reducer';
// prettier-ignore
import projectStartableTask, {
  ProjectStartableTaskState
} from 'app/entities/microproject/project-startable-task/project-startable-task.reducer';
// prettier-ignore
import qPonctualTaskInfo, {
  QPonctualTaskInfoState
} from 'app/entities/qmanager/q-ponctual-task-info/q-ponctual-task-info.reducer';
// prettier-ignore
import auditEventTrigger, {
  AuditEventTriggerState
} from 'app/entities/microrisque/audit-event-trigger/audit-event-trigger.reducer';
// prettier-ignore
import kPI, {
  KPIState
} from 'app/entities/microprocess/kpi/kpi.reducer';
import processKPI, { ProcessKpiState } from '../component/statistics/dashboard/process/dashbord-reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly drawer: DrawerState;
  readonly settings: SettingsState;
  readonly fileUpload: FileUploadState;
  readonly appUtils: AppUtilsState;
  readonly department: DepartmentState;
  readonly employee: EmployeeState;
  readonly mshzFile: MshzFileState;
  readonly process: ProcessState;
  readonly task: TaskState;
  readonly condNode: CondNodeState;
  readonly edgeInfo: EdgeInfoState;
  readonly workCalender: WorkCalenderState;
  readonly publicHoliday: PublicHolidayState;
  readonly justification: JustificationState;
  readonly userExtra: UserExtraState;
  readonly procedure: ProcedureState;
  readonly typeindicator: TypeindicatorState;
  readonly typeObjectif: TypeObjectifState;
  readonly fonction: FonctionState;
  readonly objectif: ObjectifState;
  readonly indicator: IndicatorState;
  readonly notification: NotificationState;
  readonly modelEntity: ModelEntityState;
  readonly privilege: PrivilegeState;
  readonly taskfile: TaskfileState;
  readonly taskUser: TaskUserState;
  readonly taskValidationControl: TaskValidationControlState;
  readonly risk: RiskState;
  readonly riskType: RiskTypeState;
  readonly controlType: ControlTypeState;
  readonly controlMaturity: ControlMaturityState;
  readonly control: ControlState;
  readonly partenerCategory: PartenerCategoryState;
  readonly field: FieldState;
  readonly partener: PartenerState;
  readonly partenerField: PartenerFieldState;
  readonly tender: TenderState;
  readonly tenderDoc: TenderDocState;
  readonly tenderAnswer: TenderAnswerState;
  readonly tenderFile: TenderFileState;
  readonly tenderAnswerDoc: TenderAnswerDocState;
  readonly evaluationCriteria: EvaluationCriteriaState;
  readonly partenerCategoryEvaluator: PartenerCategoryEvaluatorState;
  readonly providerEvaluation: ProviderEvaluationState;
  readonly partenerCategoryValidator: PartenerCategoryValidatorState;
  readonly tenderProviderSelection: TenderProviderSelectionState;
  readonly tenderProviderSelectionValidation: TenderProviderSelectionValidationState;
  readonly tenderAnswerExecution: TenderAnswerExecutionState;
  readonly executionValidation: ExecutionValidationState;
  readonly executionValidationFile: ExecutionValidationFileState;
  readonly tenderAnswerExecutionFile: TenderAnswerExecutionFileState;
  readonly tenderExecutionEvaluation: TenderExecutionEvaluationState;
  readonly partenerFieldFile: PartenerFieldFileState;
  readonly providerExpedition: ProviderExpeditionState;
  readonly dynamicField: DynamicFieldState;
  readonly tenderAnswerField: TenderAnswerFieldState;
  readonly providerExecutionAverage: ProviderExecutionAverageState;
  readonly taskStatusTraking: TaskStatusTrakingState;
  readonly taskStatusTrakingFile: TaskStatusTrakingFileState;
  readonly processCategory: ProcessCategoryState;
  readonly query: QueryState;
  readonly queryUser: QueryUserState;
  readonly queryField: QueryFieldState;
  readonly queryFieldResponse: QueryFieldResponseState;
  readonly queryFieldResponseFile: QueryFieldResponseFileState;
  readonly queryUserValidator: QueryUserValidatorState;
  readonly queryClientType: QueryClientTypeState;
  readonly queryClient: QueryClientState;
  readonly qCategory: QCategoryState;
  readonly queryFile: QueryFileState;
  readonly queryInstance: QueryInstanceState;
  readonly queryInstanceValidation: QueryInstanceValidationState;
  readonly queryInstanceValidationFile: QueryInstanceValidationFileState;
  readonly agendaEvent: AgendaEventState;
  readonly eventFile: EventFileState;
  readonly eventParticipant: EventParticipantState;
  readonly eventExeption: EventExeptionState;
  readonly eventTrigger: EventTriggerState;
  readonly taskItem: TaskItemState;
  readonly itemCheckJustificationFile: ItemCheckJustificationFileState;
  readonly itemCheckJustification: ItemCheckJustificationState;
  readonly projectEdgeInfo: ProjectEdgeInfoState;
  readonly projectEventTrigger: ProjectEventTriggerState;
  readonly projectItemCheckJustification: ProjectItemCheckJustificationState;
  readonly projectItemCheckJustificationFile: ProjectItemCheckJustificationFileState;
  readonly projectPublicHoliday: ProjectPublicHolidayState;
  readonly projectTask: ProjectTaskState;
  readonly projectTaskFile: ProjectTaskFileState;
  readonly projectTaskItem: ProjectTaskItemState;
  readonly projectTaskStatusTraking: ProjectTaskStatusTrakingState;
  readonly projectTaskStatusTrakingFile: ProjectTaskStatusTrakingFileState;
  readonly projectTaskSubmission: ProjectTaskSubmissionState;
  readonly projectTaskUser: ProjectTaskUserState;
  readonly projectTaskValidationControl: ProjectTaskValidationControlState;
  readonly project: ProjectState;
  readonly projectCategory: ProjectCategoryState;
  readonly projectCalendar: ProjectCalendarState;
  readonly projectCondNode: ProjectCondNodeState;
  readonly projectFile: ProjectFileState;
  readonly projectComment: ProjectCommentState;
  readonly projectCommentFile: ProjectCommentFileState;
  readonly tenderProvider: TenderProviderState;
  readonly equipement: EquipementState;
  readonly engeneering: EngeneeringState;
  readonly consommable: ConsommableState;
  readonly changement: ChangementState;
  readonly approvisionnement: ApprovisionnementState;
  readonly processCategoryUser: ProcessCategoryUserState;
  readonly userFile: UserFileState;
  readonly audit: AuditState;
  readonly auditUser: AuditUserState;
  readonly auditStatusTraking: AuditStatusTrakingState;
  readonly auditStatusTrakingFile: AuditStatusTrakingFileState;
  readonly auditRecommendationFile: AuditRecommendationFileState;
  readonly auditRecommendation: AuditRecommendationState;
  readonly auditCycle: AuditCycleState;
  readonly auditRecomUser: AuditRecomUserState;
  readonly projectStartableTask: ProjectStartableTaskState;
  readonly qPonctualTaskInfo: QPonctualTaskInfoState;
  readonly auditEventTrigger: AuditEventTriggerState;
  readonly kPI: KPIState;
  readonly processKPI: ProcessKpiState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  drawer,
  settings,
  fileUpload,
  appUtils,
  department,
  employee,
  mshzFile,
  process,
  task,
  condNode,
  edgeInfo,
  workCalender,
  publicHoliday,
  justification,
  userExtra,
  procedure,
  typeindicator,
  typeObjectif,
  fonction,
  objectif,
  indicator,
  notification,
  modelEntity,
  privilege,
  taskfile,
  taskUser,
  taskValidationControl,
  risk,
  riskType,
  controlType,
  controlMaturity,
  control,
  partenerCategory,
  field,
  partener,
  partenerField,
  tender,
  tenderDoc,
  tenderAnswer,
  tenderFile,
  tenderAnswerDoc,
  evaluationCriteria,
  partenerCategoryEvaluator,
  providerEvaluation,
  partenerCategoryValidator,
  tenderProviderSelection,
  tenderProviderSelectionValidation,
  tenderAnswerExecution,
  executionValidation,
  executionValidationFile,
  tenderAnswerExecutionFile,
  tenderExecutionEvaluation,
  partenerFieldFile,
  providerExpedition,
  dynamicField,
  tenderAnswerField,
  providerExecutionAverage,
  taskStatusTraking,
  taskStatusTrakingFile,
  processCategory,
  query,
  queryUser,
  queryField,
  queryFieldResponse,
  queryFieldResponseFile,
  queryUserValidator,
  queryClientType,
  queryClient,
  qCategory,
  queryFile,
  queryInstance,
  queryInstanceValidation,
  queryInstanceValidationFile,
  agendaEvent,
  eventFile,
  eventParticipant,
  eventExeption,
  eventTrigger,
  taskItem,
  itemCheckJustificationFile,
  itemCheckJustification,
  projectEdgeInfo,
  projectEventTrigger,
  projectItemCheckJustification,
  projectItemCheckJustificationFile,
  projectPublicHoliday,
  projectTask,
  projectTaskFile,
  projectTaskItem,
  projectTaskStatusTraking,
  projectTaskStatusTrakingFile,
  projectTaskSubmission,
  projectTaskUser,
  projectTaskValidationControl,
  project,
  projectCategory,
  projectCalendar,
  projectCondNode,
  projectFile,
  projectComment,
  projectCommentFile,
  tenderProvider,
  equipement,
  engeneering,
  consommable,
  changement,
  approvisionnement,
  processCategoryUser,
  userFile,
  audit,
  auditUser,
  auditStatusTraking,
  auditStatusTrakingFile,
  auditRecommendationFile,
  auditRecommendation,
  auditCycle,
  auditRecomUser,
  projectStartableTask,
  qPonctualTaskInfo,
  auditEventTrigger,
  kPI,
  processKPI,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
