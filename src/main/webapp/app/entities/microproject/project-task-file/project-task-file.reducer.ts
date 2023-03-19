import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectTaskFile, defaultValue } from 'app/shared/model/microproject/project-task-file.model';

export const ACTION_TYPES = {
  FETCH_PROJECTTASKFILE_LIST: 'projectTaskFile/FETCH_PROJECTTASKFILE_LIST',
  FETCH_PROJECTTASKFILE: 'projectTaskFile/FETCH_PROJECTTASKFILE',
  CREATE_PROJECTTASKFILE: 'projectTaskFile/CREATE_PROJECTTASKFILE',
  UPDATE_PROJECTTASKFILE: 'projectTaskFile/UPDATE_PROJECTTASKFILE',
  DELETE_PROJECTTASKFILE: 'projectTaskFile/DELETE_PROJECTTASKFILE',
  RESET: 'projectTaskFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectTaskFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectTaskFileState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectTaskFileState = initialState, action): ProjectTaskFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTTASKFILE):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTTASKFILE):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTTASKFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKFILE):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTTASKFILE):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTTASKFILE):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTTASKFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTTASKFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTTASKFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTTASKFILE):
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

const apiUrl = 'services/microproject/api/project-task-files';

// Actions

export const getEntities: ICrudGetAllAction<IProjectTaskFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKFILE_LIST,
    payload: axios.get<IProjectTaskFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectTaskFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKFILE,
    payload: axios.get<IProjectTaskFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectTaskFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTTASKFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectTaskFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTTASKFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectTaskFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTTASKFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
