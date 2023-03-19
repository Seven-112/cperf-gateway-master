import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITaskStatusTrakingFile, defaultValue } from 'app/shared/model/microprocess/task-status-traking-file.model';

export const ACTION_TYPES = {
  FETCH_TASKSTATUSTRAKINGFILE_LIST: 'taskStatusTrakingFile/FETCH_TASKSTATUSTRAKINGFILE_LIST',
  FETCH_TASKSTATUSTRAKINGFILE: 'taskStatusTrakingFile/FETCH_TASKSTATUSTRAKINGFILE',
  CREATE_TASKSTATUSTRAKINGFILE: 'taskStatusTrakingFile/CREATE_TASKSTATUSTRAKINGFILE',
  UPDATE_TASKSTATUSTRAKINGFILE: 'taskStatusTrakingFile/UPDATE_TASKSTATUSTRAKINGFILE',
  DELETE_TASKSTATUSTRAKINGFILE: 'taskStatusTrakingFile/DELETE_TASKSTATUSTRAKINGFILE',
  RESET: 'taskStatusTrakingFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITaskStatusTrakingFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TaskStatusTrakingFileState = Readonly<typeof initialState>;

// Reducer

export default (state: TaskStatusTrakingFileState = initialState, action): TaskStatusTrakingFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TASKSTATUSTRAKINGFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TASKSTATUSTRAKINGFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TASKSTATUSTRAKINGFILE):
    case REQUEST(ACTION_TYPES.UPDATE_TASKSTATUSTRAKINGFILE):
    case REQUEST(ACTION_TYPES.DELETE_TASKSTATUSTRAKINGFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TASKSTATUSTRAKINGFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TASKSTATUSTRAKINGFILE):
    case FAILURE(ACTION_TYPES.CREATE_TASKSTATUSTRAKINGFILE):
    case FAILURE(ACTION_TYPES.UPDATE_TASKSTATUSTRAKINGFILE):
    case FAILURE(ACTION_TYPES.DELETE_TASKSTATUSTRAKINGFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKSTATUSTRAKINGFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKSTATUSTRAKINGFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TASKSTATUSTRAKINGFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_TASKSTATUSTRAKINGFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TASKSTATUSTRAKINGFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'services/microprocess/api/task-status-traking-files';

// Actions

export const getEntities: ICrudGetAllAction<ITaskStatusTrakingFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TASKSTATUSTRAKINGFILE_LIST,
    payload: axios.get<ITaskStatusTrakingFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITaskStatusTrakingFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TASKSTATUSTRAKINGFILE,
    payload: axios.get<ITaskStatusTrakingFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITaskStatusTrakingFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TASKSTATUSTRAKINGFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITaskStatusTrakingFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TASKSTATUSTRAKINGFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITaskStatusTrakingFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TASKSTATUSTRAKINGFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
