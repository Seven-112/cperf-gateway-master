import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITaskStatusTraking, defaultValue } from 'app/shared/model/microprocess/task-status-traking.model';

export const ACTION_TYPES = {
  FETCH_TASKSTATUSTRAKING_LIST: 'taskStatusTraking/FETCH_TASKSTATUSTRAKING_LIST',
  FETCH_TASKSTATUSTRAKING: 'taskStatusTraking/FETCH_TASKSTATUSTRAKING',
  CREATE_TASKSTATUSTRAKING: 'taskStatusTraking/CREATE_TASKSTATUSTRAKING',
  UPDATE_TASKSTATUSTRAKING: 'taskStatusTraking/UPDATE_TASKSTATUSTRAKING',
  DELETE_TASKSTATUSTRAKING: 'taskStatusTraking/DELETE_TASKSTATUSTRAKING',
  SET_BLOB: 'taskStatusTraking/SET_BLOB',
  RESET: 'taskStatusTraking/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITaskStatusTraking>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TaskStatusTrakingState = Readonly<typeof initialState>;

// Reducer

export default (state: TaskStatusTrakingState = initialState, action): TaskStatusTrakingState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TASKSTATUSTRAKING_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TASKSTATUSTRAKING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TASKSTATUSTRAKING):
    case REQUEST(ACTION_TYPES.UPDATE_TASKSTATUSTRAKING):
    case REQUEST(ACTION_TYPES.DELETE_TASKSTATUSTRAKING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TASKSTATUSTRAKING_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TASKSTATUSTRAKING):
    case FAILURE(ACTION_TYPES.CREATE_TASKSTATUSTRAKING):
    case FAILURE(ACTION_TYPES.UPDATE_TASKSTATUSTRAKING):
    case FAILURE(ACTION_TYPES.DELETE_TASKSTATUSTRAKING):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKSTATUSTRAKING_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKSTATUSTRAKING):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TASKSTATUSTRAKING):
    case SUCCESS(ACTION_TYPES.UPDATE_TASKSTATUSTRAKING):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TASKSTATUSTRAKING):
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

const apiUrl = 'services/microprocess/api/task-status-trakings';

// Actions

export const getEntities: ICrudGetAllAction<ITaskStatusTraking> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TASKSTATUSTRAKING_LIST,
    payload: axios.get<ITaskStatusTraking>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITaskStatusTraking> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TASKSTATUSTRAKING,
    payload: axios.get<ITaskStatusTraking>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITaskStatusTraking> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TASKSTATUSTRAKING,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITaskStatusTraking> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TASKSTATUSTRAKING,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITaskStatusTraking> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TASKSTATUSTRAKING,
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
