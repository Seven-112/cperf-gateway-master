import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProjectTask, defaultValue } from 'app/shared/model/microproject/project-task.model';

export const ACTION_TYPES = {
  FETCH_PROJECTTASK_LIST: 'projectTask/FETCH_PROJECTTASK_LIST',
  FETCH_PROJECTTASK: 'projectTask/FETCH_PROJECTTASK',
  CREATE_PROJECTTASK: 'projectTask/CREATE_PROJECTTASK',
  UPDATE_PROJECTTASK: 'projectTask/UPDATE_PROJECTTASK',
  DELETE_PROJECTTASK: 'projectTask/DELETE_PROJECTTASK',
  SET_BLOB: 'projectTask/SET_BLOB',
  RESET: 'projectTask/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectTask>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectTaskState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectTaskState = initialState, action): ProjectTaskState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASK_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTTASK):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTTASK):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTTASK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASK_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASK):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTTASK):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTTASK):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTTASK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASK_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASK):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTTASK):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTTASK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTTASK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'services/microproject/api/project-tasks';

// Actions

export const getEntities: ICrudGetAllAction<IProjectTask> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASK_LIST,
    payload: axios.get<IProjectTask>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectTask> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASK,
    payload: axios.get<IProjectTask>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectTask> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTTASK,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectTask> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTTASK,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectTask> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTTASK,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
