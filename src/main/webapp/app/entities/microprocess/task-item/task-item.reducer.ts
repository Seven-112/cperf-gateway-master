import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITaskItem, defaultValue } from 'app/shared/model/microprocess/task-item.model';

export const ACTION_TYPES = {
  FETCH_TASKITEM_LIST: 'taskItem/FETCH_TASKITEM_LIST',
  FETCH_TASKITEM: 'taskItem/FETCH_TASKITEM',
  CREATE_TASKITEM: 'taskItem/CREATE_TASKITEM',
  UPDATE_TASKITEM: 'taskItem/UPDATE_TASKITEM',
  DELETE_TASKITEM: 'taskItem/DELETE_TASKITEM',
  RESET: 'taskItem/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITaskItem>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TaskItemState = Readonly<typeof initialState>;

// Reducer

export default (state: TaskItemState = initialState, action): TaskItemState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TASKITEM_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TASKITEM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TASKITEM):
    case REQUEST(ACTION_TYPES.UPDATE_TASKITEM):
    case REQUEST(ACTION_TYPES.DELETE_TASKITEM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TASKITEM_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TASKITEM):
    case FAILURE(ACTION_TYPES.CREATE_TASKITEM):
    case FAILURE(ACTION_TYPES.UPDATE_TASKITEM):
    case FAILURE(ACTION_TYPES.DELETE_TASKITEM):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKITEM_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKITEM):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TASKITEM):
    case SUCCESS(ACTION_TYPES.UPDATE_TASKITEM):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TASKITEM):
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

const apiUrl = 'services/microprocess/api/task-items';

// Actions

export const getEntities: ICrudGetAllAction<ITaskItem> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TASKITEM_LIST,
    payload: axios.get<ITaskItem>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITaskItem> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TASKITEM,
    payload: axios.get<ITaskItem>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITaskItem> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TASKITEM,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITaskItem> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TASKITEM,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITaskItem> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TASKITEM,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
