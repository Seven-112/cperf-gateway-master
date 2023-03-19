import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITaskfile, defaultValue } from 'app/shared/model/microprocess/taskfile.model';

export const ACTION_TYPES = {
  FETCH_TASKFILE_LIST: 'taskfile/FETCH_TASKFILE_LIST',
  FETCH_TASKFILE: 'taskfile/FETCH_TASKFILE',
  CREATE_TASKFILE: 'taskfile/CREATE_TASKFILE',
  UPDATE_TASKFILE: 'taskfile/UPDATE_TASKFILE',
  DELETE_TASKFILE: 'taskfile/DELETE_TASKFILE',
  RESET: 'taskfile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITaskfile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TaskfileState = Readonly<typeof initialState>;

// Reducer

export default (state: TaskfileState = initialState, action): TaskfileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TASKFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TASKFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TASKFILE):
    case REQUEST(ACTION_TYPES.UPDATE_TASKFILE):
    case REQUEST(ACTION_TYPES.DELETE_TASKFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TASKFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TASKFILE):
    case FAILURE(ACTION_TYPES.CREATE_TASKFILE):
    case FAILURE(ACTION_TYPES.UPDATE_TASKFILE):
    case FAILURE(ACTION_TYPES.DELETE_TASKFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TASKFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_TASKFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TASKFILE):
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

const apiUrl = 'services/microprocess/api/taskfiles';

// Actions

export const getEntities: ICrudGetAllAction<ITaskfile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TASKFILE_LIST,
    payload: axios.get<ITaskfile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITaskfile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TASKFILE,
    payload: axios.get<ITaskfile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITaskfile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TASKFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITaskfile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TASKFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITaskfile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TASKFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
