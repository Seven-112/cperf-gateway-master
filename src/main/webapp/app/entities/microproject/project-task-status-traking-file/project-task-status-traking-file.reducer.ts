import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectTaskStatusTrakingFile, defaultValue } from 'app/shared/model/microproject/project-task-status-traking-file.model';

export const ACTION_TYPES = {
  FETCH_PROJECTTASKSTATUSTRAKINGFILE_LIST: 'projectTaskStatusTrakingFile/FETCH_PROJECTTASKSTATUSTRAKINGFILE_LIST',
  FETCH_PROJECTTASKSTATUSTRAKINGFILE: 'projectTaskStatusTrakingFile/FETCH_PROJECTTASKSTATUSTRAKINGFILE',
  CREATE_PROJECTTASKSTATUSTRAKINGFILE: 'projectTaskStatusTrakingFile/CREATE_PROJECTTASKSTATUSTRAKINGFILE',
  UPDATE_PROJECTTASKSTATUSTRAKINGFILE: 'projectTaskStatusTrakingFile/UPDATE_PROJECTTASKSTATUSTRAKINGFILE',
  DELETE_PROJECTTASKSTATUSTRAKINGFILE: 'projectTaskStatusTrakingFile/DELETE_PROJECTTASKSTATUSTRAKINGFILE',
  RESET: 'projectTaskStatusTrakingFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectTaskStatusTrakingFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectTaskStatusTrakingFileState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectTaskStatusTrakingFileState = initialState, action): ProjectTaskStatusTrakingFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKINGFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKINGFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTTASKSTATUSTRAKINGFILE):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTTASKSTATUSTRAKINGFILE):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTTASKSTATUSTRAKINGFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKINGFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKINGFILE):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTTASKSTATUSTRAKINGFILE):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTTASKSTATUSTRAKINGFILE):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTTASKSTATUSTRAKINGFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKINGFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKINGFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTTASKSTATUSTRAKINGFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTTASKSTATUSTRAKINGFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTTASKSTATUSTRAKINGFILE):
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

const apiUrl = 'services/microproject/api/project-task-status-traking-files';

// Actions

export const getEntities: ICrudGetAllAction<IProjectTaskStatusTrakingFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKINGFILE_LIST,
    payload: axios.get<IProjectTaskStatusTrakingFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectTaskStatusTrakingFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKINGFILE,
    payload: axios.get<IProjectTaskStatusTrakingFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectTaskStatusTrakingFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTTASKSTATUSTRAKINGFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectTaskStatusTrakingFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTTASKSTATUSTRAKINGFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectTaskStatusTrakingFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTTASKSTATUSTRAKINGFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
