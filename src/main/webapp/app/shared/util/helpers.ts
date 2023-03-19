import { IMshzFile } from '../model/microfilemanager/mshz-file.model';
import axios from 'axios';
import { IEmployee } from '../model/employee.model';
import { ITask } from '../model/microprocess/task.model';
import { IProcess } from '../model/microprocess/process.model';
import { ProcessPriority } from '../model/enumerations/process-priority.model';
import { TaskStatus } from '../model/enumerations/task-status.model';
import {
  addToDate,
  convertDateFromServer,
  convertDateTimeToServer,
  createDateFromString,
  getMilliSecondsBetweenToDate,
} from './date-utils';
import { IChrono, defaultValue as ChronoDefault } from './chrono.model';
import { translate } from 'react-jhipster';
import { cleanEntity } from './entity-utils';
import { IWorkCalender } from '../model/work-calender.model';
import { IPublicHoliday } from '../model/public-holiday.model';
import { IObjectif } from '../model/objectif.model';
import { ObjectifTypeEvaluationUnity } from '../model/enumerations/objectif-type-evaluation-unity.model';
import { IIndicator } from '../model/indicator.model';
import { notifyTaskStatusChanged } from './notification-util';
import { IUser } from '../model/user.model';
import { IUserExtra } from '../model/user-extra.model';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
import { IAgendaEvent } from '../model/microagenda/agenda-event.model';
import { EventRecurrence } from '../model/enumerations/event-recurrence.model';
import { IProjectTask } from '../model/microproject/project-task.model';
import { ProjectPriority } from '../model/enumerations/project-priority.model';
import { ProjectTaskStatus } from '../model/enumerations/project-task-status.model';
import { ITaskProject } from '../model/projection/task-project.model';
import { faFile, faFileExcel, faFilePdf, faFileWord, faImage, faVideo } from '@fortawesome/free-solid-svg-icons';
import { IChronoUtil } from './chrono-util.model';
import { FileEntityTag } from '../model/file-chunk.model';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';

export const API_URIS = {
  depatartmentApiUri: 'api/departments',
  employeeApiUri: 'api/employees',
  userFileApiUri: 'api/user-files',
  fonctionApiUri: 'api/fonctions',
  mshzFileApiUri: 'services/microfilemanager/api/mshz-files',
  dynamicFieldApiUri: 'api/dynamic-fields',
  processApiUri: 'services/microprocess/api/processes',
  processCategoryApiUri: 'services/microprocess/api/process-categories',
  processCategoryUserApiUri: 'services/microprocess/api/process-category-users',
  processEventApiUri: 'services/microprocess/api/event-triggers',
  taskApiUri: 'services/microprocess/api/tasks',
  taskDependencyApiUri: 'services/microprocess/api/task-dependencies',
  taskItemApiUri: 'services/microprocess/api/task-items',
  taskItemCheckJustificationApiUri: 'services/microprocess/api/item-check-justifications',
  taskItemCheckJustificationFileApiUri: 'services/microprocess/api/item-check-justification-files',
  condNodeApiUri: 'services/microprocess/api/cond-nodes',
  edgeInfoApiUri: 'services/microprocess/api/edge-infos',
  workCalenderApiUri: 'services/microprocess/api/work-calenders',
  publicHolidyApiUri: 'services/microprocess/api/public-holidays',
  processStatApiUri: 'services/microprocess/api/stats/kpis',
  userApiUri: 'api/users',
  userExtraApiUri: 'api/user-extras',
  justificationsApiUrl: 'services/microprocess/api/justifications',
  procedureApiUri: 'services/microprocess/api/procedures',
  typeObjectifApiUri: 'api/type-objectifs',
  typeindicatorApiUri: 'api/typeindicators',
  objectifApiUri: 'api/objectifs',
  indicatorApiUri: 'api/indicators',
  notificationApiUri: 'api/notifications',
  taskFileApiUri: 'services/microprocess/api/task-files',
  taskUserApiUri: 'services/microprocess/api/task-users',
  taskValidationControlApi: 'services/microprocess/api/task-validation-controls',
  taskStatusTrakingApiUri: 'services/microprocess/api/task-status-trakings',
  taskStatusTrakingFileApiUri: 'services/microprocess/api/task-status-traking-files',
  riskApiUri: 'services/microrisque/api/risks',
  riskTypeApiUri: 'services/microrisque/api/risk-types',
  controlApiUri: 'services/microrisque/api/controls',
  riskControlTypeApiUri: 'services/microrisque/api/control-types',
  riskControlMaturityApiUri: 'services/microrisque/api/control-maturities',
  partenerCategoryApiUri: 'services/micropartener/api/partener-categories',
  partenerApiUri: 'services/micropartener/api/parteners',
  partenerFiledApiUri: 'services/micropartener/api/partener-fields',
  partenerFieldModelApiUri: 'services/micropartener/api/fields',
  partenerCategoryEvaluatorApiUri: 'services/micropartener/api/partener-category-evaluators',
  partenerCategoryEvaluationCriteriaApiUri: 'services/micropartener/api/evaluation-criteria',
  partenerCategoryValidatorApiUri: 'services/micropartener/api/partener-category-validators',
  partenerFieldFileApiUri: 'services/micropartener/api/partener-field-files',
  tenderApiUri: 'services/microprovider/api/tenders',
  tenderProviderApiUri: 'services/microprovider/api/tender-providers',
  tenderDocApiUri: 'services/microprovider/api/tender-docs',
  tenderAnswerApiUir: 'services/microprovider/api/tender-answers',
  tenderFileApiUri: 'services/microprovider/api/tender-files',
  tenderAnswerDocApiUir: 'services/microprovider/api/tender-answer-docs',
  tenderProviderSelectionApiUri: 'services/microprovider/api/tender-provider-selections',
  tenderFieldApiUri: 'services/microprovider/api/tender-fields',
  tenderAnswerFieldApiUri: 'services/microprovider/api/tender-answer-fields',
  providerSelectionValidationApiUri: 'services/microprovider/api/tender-provider-selection-validations',
  providerEvaluationApiUri: 'services/microprovider/api/provider-evaluations',
  providerExpeditionApiUri: 'services/microprovider/api/provider-expeditions',
  providerExecutionAverageApiUri: 'services/microprovider/api/provider-execution-averages',
  tenderExecutionApiUri: 'services/microprovider/api/tender-answer-executions',
  tenderExecutionFileApiUri: 'services/microprovider/api/tender-answer-execution-files',
  tenderExecutionValidationApiUri: 'services/microprovider/api/execution-validations',
  tenderExecutionEvaluationApiUri: 'services/microprovider/api/tender-execution-evaluations',
  queryClientTypeApiUri: 'services/qmanager/api/query-client-types',
  queryClientApiUri: 'services/qmanager/api/query-clients',
  queryApiUri: 'services/qmanager/api/queries',
  queryUserApiUri: 'services/qmanager/api/query-users',
  queryUserValidatorsApiUri: 'services/qmanager/api/query-user-validators',
  queryCategoryApiUri: 'services/qmanager/api/q-categories',
  queryFieldApiUri: 'services/qmanager/api/query-fields',
  queryFileApiUri: 'services/qmanager/api/query-files',
  queryResponseField: 'services/qmanager/api/query-field-responses',
  queryResponseFieldFile: 'services/qmanager/api/query-field-response-files',
  queryInstanceApiUri: 'services/qmanager/api/query-instances',
  queryInstanceValidationApiUri: 'services/qmanager/api/query-instance-validations',
  queryInstanceValidationFileApiUri: 'services/qmanager/api/query-instance-validation-files',
  queryPonctualTaskInfoApiUri: 'services/qmanager/api/q-ponctual-task-infos',
  agendaEventApiUri: 'services/microagenda/api/agenda-events',
  eventParticipantApiUri: 'services/microagenda/api/event-participants',
  eventFileApiUri: 'services/microagenda/api/event-files',
  eventExceptionApiUri: 'services/microagenda/api/event-exeptions',
  projectApiUri: 'services/microproject/api/projects',
  projectCategoryApiUri: 'services/microproject/api/project-categories',
  projectTaskApiUri: 'services/microproject/api/project-tasks',
  projectTaskItemApiUri: 'services/microproject/api/project-task-items',
  projectTaskItemCheckJustificationApiUri: 'services/microproject/api/project-item-check-justifications',
  projectTaskStatusTrakingApiUri: 'services/microproject/api/project-task-status-trakings',
  projectTaskUserApiUri: 'services/microproject/api/project-task-users',
  projectTaskStatusTrakingFileApiUri: 'services/microproject/api/project-task-status-traking-files',
  projectEdgeInfoApiUri: 'services/microproject/api/project-edge-infos',
  projectCondNodeApiUri: 'services/microproject/api/project-cond-nodes',
  projectTaskFileApiUri: 'services/microproject/api/project-task-files',
  projectPublicHolidayApiUri: 'services/microproject/api/project-public-holidays',
  projectCalendarApiUri: 'services/microproject/api/project-calendars',
  projectFileApiUri: 'services/microproject/api/project-files',
  projectCommentApiUri: 'services/microproject/api/project-comments',
  projectCommentFileApiUri: 'services/microproject/api/project-comment-files',
  projecttaskItemCheckJustificationApiUri: 'services/microproject/api/project-item-check-justifications',
  projectTaskItemCheckJustificationFileApiUri: 'services/microproject/api/project-item-check-justification-files',
  projectStartableTasksApiUri: 'services/microproject/api/project-startable-tasks',
  // microtock api
  equipementApi: 'services/microstock/api/equipements',
  consommableApi: 'services/microstock/api/consommables',
  engeneeringApi: 'services/microstock/api/engeneerings',
  changementApi: 'services/microstock/api/changements',
  approvisionmentApi: 'services/microstock/api/approvisionnements',

  // audits apis
  auditApiUri: 'services/microrisque/api/audits',
  auditUserApiUri: 'services/microrisque/api/audit-users',
  auditStatusTrackingApiUri: 'services/microrisque/api/audit-status-trakings',
  auditStatusTrackingFileApiUri: 'services/microrisque/api/audit-status-traking-files',
  auditEventTriggerApiUri: 'services/microrisque/api/audit-event-triggers',
  auditRecommendationApiUri: 'services/microrisque/api/audit-recommendations',
  auditRecommendationFileApiUri: 'services/microrisque/api/audit-recommendation-files',
  auditCycleApiUri: 'services/microrisque/api/audit-cycles',
  auditRecomUserApiUri: 'services/microrisque/api/audit-recom-users',
};

export const groupBy = (array, key) => {
  return array.reduce((acc, obj) => {
    const property = obj[key];
    acc[property] = acc[property] || [];
    acc[property].push(obj);
    return acc;
  }, {});
};

export const formateBase64Src = (contentType, byteContentData) =>
  contentType && byteContentData ? `data:${contentType};base64,${byteContentData.toString('base64')}` : null;

export const getMshzFileUri = (file: IMshzFile) => {
  if (file && file.id) {
    return formateBase64Src(file.fDataContentType, file.fData);
  }
  const byteArray = new Uint8Array(file.fData);
  const blob = new Blob([byteArray], { type: file.fDataContentType });
  return URL.createObjectURL(blob);
};

export const convertArrayBufferToByTeArray = (buffer: ArrayBuffer) => {
  // res is this.response in your case
  const view = new Uint8Array(buffer);
  const byteArray = [];
  for (const byte of view) {
    byteArray.push(byte);
  }
  return byteArray;
};

export const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const fileIsAnImage = (type: string) => {
  if (type) return type.toLowerCase().includes('image');
  return false;
};

export const findEmployee = (employees: IEmployee[], id: any): IEmployee => {
  if (employees && employees.length > 0) return employees.find(emp => emp.id === id);
  return null;
};

export const getTaskPriorityLevel = (task: ITask, process: IProcess): ProcessPriority => {
  if (task) {
    if (task.status === TaskStatus.STARTED) return process && process.priorityLevel ? process.priorityLevel : ProcessPriority.VERYHIGTH;
    else if (task.status === TaskStatus.VALID) return ProcessPriority.LOW;
    else return ProcessPriority.VERYLOW;
  }
  return ProcessPriority.VERYLOW;
};

export const getProjectTaskPriorityLevel = (task: IProjectTask, project: IProjectTask): ProjectPriority => {
  if (task) {
    if (task.status === ProjectTaskStatus.STARTED)
      return project && project.priorityLevel ? project.priorityLevel : ProjectPriority.VERYHIGTH;
    else if (task.status === ProjectTaskStatus.VALID) return ProjectPriority.LOW;
    else return ProjectPriority.VERYLOW;
  }
  return ProjectPriority.VERYLOW;
};

export function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);
  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

export const downLoadFile = (file: IMshzFile) => {
  if (file) {
    const ext = file.fDataContentType.substring(file.fDataContentType.lastIndexOf('/') + 1, file.fDataContentType.length);
    const filename = file.name ? file.name : 'download.' + ext;
    const byteArray = base64ToArrayBuffer(file.fData);
    const blob = new Blob([byteArray], { type: file.fDataContentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  }
};

export const fileIsReadableOnBrowser = (file: IMshzFile): boolean => {
  const fileType = file.fDataContentType.toLowerCase();
  if (fileType.includes('pdf') || fileType.includes('image')) return true;
  return false;
};

export const openMshzFile = (file: IMshzFile) => {
  if (file) {
    if (fileIsReadableOnBrowser(file)) {
      const win = window.open('/file-viewer/' + file.id, '_blank');
      if (win != null) {
        win.focus();
      }
    } else {
      downLoadFile(file);
    }
  }
};

export const getTaskPreviewFinishAt = (task: ITask | IProjectTask): Date => {
  if (task && task.startAt && task.status !== TaskStatus.CANCELED) {
    return addToDate(convertDateTimeToServer(task.startAt), {
      nbYears: task.nbYears,
      nbMonths: task.nbMonths,
      nbDays: task.nbDays,
      nbHours: task.nbHours,
      nbMinutes: task.nbMinuites,
    });
  }
  return null;
};

export const monthsDiff = (startDate: Date, endDate: Date): number => {
  if (startDate && endDate) {
    if (endDate < startDate) {
      const tmpDate = startDate;
      startDate = endDate;
      endDate = tmpDate;
    }
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = years * 12 + (endDate.getMonth() - startDate.getMonth());
    return months;
  }
  return 0;
};

export const getChrono = (startDate: Date, endDate: Date): IChrono => {
  const chrono: IChrono = ChronoDefault;
  if (startDate && endDate) {
    if (startDate > endDate) chrono.exceeced = true;
    else chrono.exceeced = false;

    let diff = Math.abs(getMilliSecondsBetweenToDate(startDate, endDate) / 1000);
    if (diff && diff > 0) {
      const nbDays = Math.abs(Math.floor(diff / 86400));
      (chrono.nbDays = nbDays), (diff = diff - nbDays * 86400);
      if (diff > 0) {
        const nbHours = Math.abs(Math.floor(diff / 3600));
        chrono.nbHours = nbHours;
        diff = diff - nbHours * 3600;
        if (diff > 0) {
          const nbMinuites = Math.abs(Math.floor(diff / 60));
          chrono.nbMinutes = nbMinuites;
          diff = diff - nbMinuites * 60;
          if (diff > 0) chrono.nbSeconds = diff;
        }
      }
    }
  }
  return chrono;
};

export const getChronoData = (chronoUtil: IChronoUtil): IChrono => {
  if (chronoUtil) {
    if ([TaskStatus.STARTED, TaskStatus.EXECUTED, TaskStatus.SUBMITTED].includes(chronoUtil.status))
      return getChrono(new Date(), createDateFromString(chronoUtil.prviewFinishDate));
    if (chronoUtil.startDate && chronoUtil.status === TaskStatus.ON_PAUSE && chronoUtil.pausedDate && !chronoUtil.finishDate)
      return getChrono(createDateFromString(chronoUtil.pausedDate), createDateFromString(chronoUtil.prviewFinishDate));
    if (chronoUtil.finishDate && chronoUtil.prviewFinishDate) {
      return getChrono(createDateFromString(chronoUtil.finishDate), createDateFromString(chronoUtil.prviewFinishDate));
    }
  }
  return null;
};

export const getTaskChronoData = (task: ITask | IProjectTask): IChrono => {
  if (task) {
    const taskStatus = task.status ? task.status.toString() : null;
    if (
      task.startAt &&
      (taskStatus === TaskStatus.STARTED.toString() ||
        taskStatus === TaskStatus.EXECUTED.toString() ||
        taskStatus === TaskStatus.SUBMITTED.toString()) &&
      !task.finishAt
    )
      return getChrono(new Date(), getTaskPreviewFinishAt(task));
    if (task.startAt && taskStatus === TaskStatus.ON_PAUSE.toString() && task.pauseAt && !task.finishAt)
      return getChrono(createDateFromString(task.pauseAt), getTaskPreviewFinishAt(task));
    if (task.startAt && taskStatus === TaskStatus.COMPLETED.toString() && task.finishAt)
      return getChrono(createDateFromString(task.finishAt), getTaskPreviewFinishAt(task));
  }
  return null;
};

export const getChronoText = (chronoData: IChrono, toFixed?: number): string => {
  let chrono = '';
  toFixed = toFixed ? toFixed : 0;
  if (chronoData) {
    if (chronoData.nbYears) chrono = chrono + chronoData.nbYears.toFixed(toFixed) + translate('_global.label.y') + ', ';
    if (chronoData.nbMonths) chrono = chrono + chronoData.nbMonths.toFixed(toFixed) + translate('_global.label.m') + ', ';
    if (chronoData.nbDays) chrono = chrono + chronoData.nbDays.toFixed(toFixed) + translate('_global.label.d') + ', ';
    if (chronoData.nbHours) chrono = chrono + chronoData.nbHours.toFixed(toFixed) + translate('_global.label.h') + ', ';
    if (chronoData.nbMinutes)
      chrono =
        chrono +
        chronoData.nbMinutes.toFixed(toFixed) +
        translate('_global.label.mm') +
        (chrono && chrono !== '' ? ' ' + translate('_global.label.and') + ' ' : ' ');
    if (chronoData.nbSeconds) chrono = chrono + chronoData.nbSeconds.toFixed(toFixed) + translate('_global.label.s');
    return chrono;
  }
  return null;
};

export const getChronoTextWithSuffix = (chronoUtil: IChronoUtil, toFixed?: number) => {
  if (chronoUtil) {
    const chrono = getChronoText(getChronoData(chronoUtil), toFixed);
    if (chrono && chrono.length !== 0) {
      if (chronoUtil.status === TaskStatus.STARTED || chronoUtil.status === TaskStatus.ON_PAUSE)
        return `${chrono} ${translate('_global.label.' + (chronoUtil.execeed ? 'lost' : 'remaining'))}`;
      else if (chronoUtil.status === TaskStatus.COMPLETED)
        return `${chrono} ${translate('_global.label.' + (chronoUtil.execeed ? 'lost' : 'gained'))}`;
      else return chrono;
    }
  }
  return '';
};

const getTaskWithNewStatus = (task: ITask, status: TaskStatus): ITask => {
  if (task && status) {
    task.status = status;
    if (status === TaskStatus.STARTED) {
      task.finishAt = null;
      task.startAt = new Date().toISOString();
      task.pauseAt = null;
    }

    if (status === TaskStatus.COMPLETED) task.finishAt = new Date().toISOString();

    if (status === TaskStatus.VALID) {
      task.startAt = null;
      task.finishAt = null;
      task.manualMode = false;
      task.nbPause = null;
      task.pauseAt = null;
    }
  }
  return task;
};

export const startTaskChildrens = (task: ITask) => {
  axios
    .get<ITask[]>(`${API_URIS.taskApiUri}/?parentId.equals=${task.id}&status.equals=${TaskStatus.VALID}`)
    .then(res => {
      const childTasks = res.data;
      if (childTasks && childTasks.length) {
        childTasks.forEach(tchild => {
          axios
            .put<ITask>(`${API_URIS.taskApiUri}`, cleanEntity(getTaskWithNewStatus(tchild, TaskStatus.STARTED)))
            .then(sartingChildres => {})
            .catch(() => {});
        });
      }
    })
    .catch(er => {
      /* eslint-disable no-console */
      console.log(er);
    });
};

export const changeTaskStatus = (task: ITask, status: TaskStatus) => {
  if (task && status) {
    task = getTaskWithNewStatus(task, status);
    axios
      .put<ITask>(`${API_URIS.taskApiUri}`, cleanEntity(task))
      .then(res => {
        if (res.data) {
          if (status === TaskStatus.CANCELED || status === TaskStatus.COMPLETED) startTaskChildrens(res.data);
          notifyTaskStatusChanged(res.data);
        }
      })
      .catch(e => {
        /* eslint-disable no-console */
        console.log(e);
      });
  }
};

export const getDayCalender = async (dayNumber: number): Promise<IWorkCalender[]> => {
  const result = await axios.get<IWorkCalender[]>(`${API_URIS.workCalenderApiUri}/?dayNumber.equals=${dayNumber}`);
  return result.data;
};
export const getPublicHolidaysOfDate = async (date: Date): Promise<IPublicHoliday[]> => {
  const result = await axios.get<IPublicHoliday[]>(`${API_URIS.publicHolidyApiUri}/?ofDate.equals=${convertDateFromServer(date)}`);
  return result.data;
};

export const isCalenderWorkingTime = (date: Date, startTime: Date, endTime: Date) => {
  startTime.setFullYear(date.getFullYear());
  startTime.setMonth(date.getMonth());
  startTime.setDate(date.getDate());
  startTime.setSeconds(0);

  endTime.setFullYear(date.getFullYear());
  endTime.setMonth(date.getMonth());
  endTime.setDate(date.getDate());
  endTime.setSeconds(0);

  /** eslint-disable no-console */
  console.log('date ' + convertDateFromServer(date) + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
  /** eslint-disable no-console */
  console.log(
    'startTime ' +
      convertDateFromServer(startTime) +
      ' ' +
      startTime.getHours() +
      ':' +
      startTime.getMinutes() +
      ':' +
      startTime.getSeconds()
  );
  /** eslint-disable no-console */
  console.log(
    'endTime ' + convertDateFromServer(endTime) + ' ' + endTime.getHours() + ':' + endTime.getMinutes() + ':' + endTime.getSeconds()
  );

  if (date >= startTime && date <= endTime) return true;
  return false;
};

export const getTotalPages = (totalItems: number, itemsPerPage: number) => {
  if (totalItems) {
    if (itemsPerPage) {
      return Math.ceil(totalItems / itemsPerPage);
    }
    return 1;
  }
  return 1;
};

export const getObjectifMaxDate = (objectif: IObjectif): Date => {
  if (objectif && objectif.typeObjectif && objectif.delay && objectif.createdAt) {
    const maxDate = convertDateTimeToServer(objectif.createdAt);
    if (maxDate) {
      if (objectif.typeObjectif.evalutationUnity === ObjectifTypeEvaluationUnity.DAY) maxDate.setDate(maxDate.getDate() + objectif.delay);
      if (objectif.typeObjectif.evalutationUnity === ObjectifTypeEvaluationUnity.MONTH)
        maxDate.setMonth(maxDate.getMonth() + objectif.delay);
      if (objectif.typeObjectif.evalutationUnity === ObjectifTypeEvaluationUnity.WEEK)
        maxDate.setDate(maxDate.getDate() + objectif.delay * 7);
      if (objectif.typeObjectif.evalutationUnity === ObjectifTypeEvaluationUnity.YEAR)
        maxDate.setFullYear(maxDate.getFullYear() + objectif.delay);
      else maxDate.setMonth(maxDate.getMonth() + objectif.delay);
    }
    return maxDate;
  }
  return null;
};

export const expiredObjectif = (objectif: IObjectif) => {
  const maxDate = getObjectifMaxDate(objectif);
  if (maxDate && maxDate >= new Date()) return false;
  return true;
};

export const calculIndicatorDataPercent = (indicator: IIndicator, indicators: IIndicator[]) => {
  if (indicator) {
    const chirlds = indicators.filter(i => i.parent && i.parent.id === indicator.id);
    if (chirlds && chirlds.length) {
      let percent = 0;
      for (let i = 0; i < chirlds.length; i++) {
        percent = percent + calculIndicatorDataPercent(chirlds[i], chirlds) / chirlds.length;
      }
      return percent;
    } else {
      const ponderation = indicator.ponderation ? indicator.ponderation : 1;
      const numberResult = indicator.numberResult ? indicator.numberResult : 0;
      if (indicator.typeindicator && indicator.typeindicator.measurable) {
        if (indicator.expectedResultNumber) return (ponderation * numberResult * 100) / indicator.expectedResultNumber;
        else return (ponderation * numberResult) / 100;
      }
      return indicator.percentResult ? indicator.percentResult : 0;
    }
  }
};

export const isIndicatorDataEditable = (indicator: IIndicator, indicators: IIndicator[]): boolean => {
  if (indicator.objectif && expiredObjectif(indicator.objectif)) return false;
  const chirlds = indicators.filter(i => i.parent && i.parent.id === indicator.id);
  if (chirlds && chirlds.length > 0) return false;
  return true;
};

export const manageObjectifRealizedState = (objectif: IObjectif) => {
  if (objectif) {
    // get paprent indicator
    axios
      .get<IIndicator[]>(`${API_URIS.indicatorApiUri}/?objectifId.equals=${objectif.id}`)
      .then(res => {
        let percentResult = 0;
        if (res.data && res.data.length) {
          for (let i = 0; i < res.data.length; i++) {
            percentResult = percentResult + calculIndicatorDataPercent(res.data[i], res.data);
          }
        }
        /* eslint-disable no-console */
        console.log(percentResult);
      })
      .catch(e => {
        /* eslint-disable no-console */
        console.log(e);
      });
  }
};

export const calculObjectifPercent = (objectif: IObjectif, indicators: IIndicator[]) => {
  let percent = 0;
  if (objectif) {
    if (indicators && indicators.length !== 0) {
      const parentIndicators = indicators.filter(ind => !ind.parent);
      for (let i = 0; i < parentIndicators.length; i++) {
        const indicator = parentIndicators[i];
        percent = percent + calculIndicatorDataPercent(indicator, indicators);
      }
      return percent;
    }
    return 100;
  }
  return 0;
};

export const getTaskEmployees = async (task: ITask) => {
  let employees: IEmployee[] = [];
  if (task) {
    // find taskusersdependecies
    const empIds = [];
    // const usersTaskDependencies = (await getTaskDependeciesByTag(task, Tag.TASKUSERS)).data;
    // empIds = [...usersTaskDependencies.map(utd => utd.dependencyId)];
    // if (task.validatorId && !empIds.find(id => id === task.validatorId)) empIds.push(task.validatorId);
    if (empIds.length > 0) employees = [...(await axios.get<IEmployee[]>(`${API_URIS.employeeApiUri}/?id.in=${empIds}`)).data];

    // find taskusers with by departments

    if (task.groupId) {
      const taskDeptEmps = (await axios.get<IEmployee[]>(`${API_URIS.employeeApiUri}/?departmentId.equals=${task.groupId}`)).data;
      for (let i = 0; i < taskDeptEmps.length; i++) {
        const emp = taskDeptEmps[i];
        if (!employees.find(em => em.id === emp.id)) employees.push(emp);
      }
    }
  }
  return employees;
};

export const getTaskUsers = async (task: ITask) => {
  let taskUsers: IUser[] = [];
  if (task) {
    const taskEmps = await getTaskEmployees(task);
    if (taskEmps.length > 0) {
      const userEtras = (await axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/?employeeId.in=${taskEmps.map(emp => emp.id)}`)).data;
      if (userEtras && userEtras.length) taskUsers = [...userEtras.map(ue => ue.user)];
    }
  }
  return taskUsers;
};

export const DEFAULT_USER_AVATAR_URI = '/content/images/user.png';

/* swal alert section */
const mySwal = withReactContent(swal);

export const showSwalAlert = (
  title: string,
  text: string,
  icon: 'error' | 'info' | 'success' | 'warning' | 'question',
  onClose?: Function
) => {
  mySwal.fire({
    title,
    text,
    icon,
    didClose: onClose ? onClose() : null,
  });
};

interface ISwalConfirm {
  title: string;
  text: string;
  icon: 'error' | 'info' | 'success' | 'warning' | 'question';
  canceBtnText?: string;
  confirmBtnText?: string;
  onConfirm?: Function;
}

export const showSwalConfirm = (args: ISwalConfirm) => {
  const { title, text, icon, canceBtnText, confirmBtnText } = args;
  mySwal
    .fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmBtnText || 'Confirm',
      cancelButtonText: canceBtnText || 'Cancel',
    })
    .then(res => {
      if (res.isConfirmed) {
        args.onConfirm();
      }
    });
};

export const navigateToBlankTab = (url: string) => {
  if (url) {
    const win = window.open(url, '_blank');
    if (win != null) {
      win.focus();
    }
  }
};

/* end swal alert section */

export const addAuthorityToUser = (userLogin: string, authority: string) => {
  if (userLogin && authority) {
    axios
      .get<IUser>(`${API_URIS.userApiUri}/with-authorities/${userLogin}`)
      .then(res => {
        if (res.data && !res.data.authorities.includes(authority)) {
          const uEntity = {
            ...res.data,
            authorities: [...res.data.authorities, authority],
          };
          axios
            .put<IUser>(`${API_URIS.userApiUri}`, cleanEntity(uEntity))
            .then(() => {})
            .catch(e => console.log(e));
        }
      })
      .catch(err => console.log(err));
  }
};

export const getUserExtraFullName = (ue: IUserExtra) => {
  let fullName = '';
  if (ue) {
    const firstName = ue.employee && ue.employee.firstName ? ue.employee.firstName : ue.user ? ue.user.firstName || '' : '';
    const lastName = ue.employee && ue.employee.lastName ? ue.employee.lastName : ue.user ? ue.user.lastName || null : null;
    fullName = lastName ? firstName + ' ' + lastName : firstName;
  }
  return fullName;
};

export const getUserExtraEmail = (ue: IUserExtra) => {
  if (ue) {
    if (ue.user && ue.user.email) return ue.user.email;
    if (ue.employee && ue.employee.email) return ue.employee.email;
  }
  return null;
};

export const getEventRecurrence = (ev?: IAgendaEvent) => {
  if (ev) {
    const startDate = ev.startAt ? new Date(ev.startAt) : null;
    const dayName = startDate ? translate('_calendar.day.' + startDate.getDay()) : '';
    const dateAndMonthName = startDate ? `${startDate.getDate()} ${translate('_calendar.month.' + startDate.getMonth())}` : '';
    if (ev.recurrence === EventRecurrence.ALLAWAYS)
      return translate('microgatewayApp.EventRecurrence.' + EventRecurrence.ALLAWAYS.toString());
    else if (ev.recurrence === EventRecurrence.WEEK) return translate('microgatewayApp.EventRecurrence.' + EventRecurrence.WEEK.toString());
    else if (ev.recurrence === EventRecurrence.EVERY_WEEK_ON_DAY)
      return translate('microgatewayApp.EventRecurrence.' + EventRecurrence.EVERY_WEEK_ON_DAY.toString(), { dayName });
    else if (ev.recurrence === EventRecurrence.EVERY_YEAR_ON_DATE)
      return translate('microgatewayApp.EventRecurrence.' + EventRecurrence.EVERY_YEAR_ON_DATE.toString(), { date: dateAndMonthName });
    else return translate('microgatewayApp.EventRecurrence.' + EventRecurrence.ONCE.toString());
  }
  return null;
};

export const getFaIconByFileName = (fileName?: string) => {
  if (fileName) {
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
    if (extension && extension.length !== 0) {
      if (['png', 'jpg', 'jpeg', 'gif', 'tiff'].includes(extension)) return faImage;
      if (['MP4', 'MOV', 'WMV', 'AVI', 'AVCHD', 'FLV', 'F4V', 'SWF', 'MKV', 'MPEG-2'].includes(extension.toUpperCase())) return faVideo;
      if (extension.includes('pdf')) return faFilePdf;
      if (extension.includes('doc')) return faFileWord;
      if (extension.includes('xls')) return faFileExcel;
    }
  }
  return faFile;
};

export const deleteUserExtraPhoto = (userExtra: IUserExtra) => {
  if (userExtra) {
    const { employee, user } = userExtra;
    if (employee) {
      employee.photoId = null;
      employee.photoName = null;
      axios
        .put(`${API_URIS.employeeApiUri}`, cleanEntity(employee))
        .then(() => {})
        .catch(e => console.log(e));
    }
  }
};

export const getMshzFileByEntityIdAndEntityTag = async (entityId: any, tag: FileEntityTag, sort?: string) => {
  let apiUri = `${API_URIS.mshzFileApiUri}`;
  if (!sort) {
    apiUri = `${apiUri}/getAllByEntityTagAndEntityId/`;
    if (tag) apiUri = `${apiUri}?entityId=${entityId}&tag=${tag.toString()}`;
  } else {
    apiUri = `${apiUri}/?entityId.equals=${entityId}`;
    if (tag) apiUri = `${apiUri}&entityTagName.equals=${tag.toString()}`;
    apiUri = `${apiUri}${sort.startsWith('&')} ? ${sort} : &${sort}`;
  }
  if (serviceIsOnline(SetupService.FILEMANAGER)) return await axios.get<IMshzFile[]>(apiUri);
  else throw `service not avalaible !`;
};
