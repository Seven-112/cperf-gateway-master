import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITaskUser, defaultValue } from 'app/shared/model/microprocess/task-user.model';

export const ACTION_TYPES = {
  FETCH_TASKUSER_LIST: 'taskUser/FETCH_TASKUSER_LIST',
  FETCH_TASKUSER: 'taskUser/FETCH_TASKUSER',
  CREATE_TASKUSER: 'taskUser/CREATE_TASKUSER',
  UPDATE_TASKUSER: 'taskUser/UPDATE_TASKUSER',
  DELETE_TASKUSER: 'taskUser/DELETE_TASKUSER',
  RESET: 'taskUser/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITaskUser>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TaskUserState = Readonly<typeof initialState>;

// Reducer

export default (state: TaskUserState = initialState, action): TaskUserState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TASKUSER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TASKUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TASKUSER):
    case REQUEST(ACTION_TYPES.UPDATE_TASKUSER):
    case REQUEST(ACTION_TYPES.DELETE_TASKUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TASKUSER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TASKUSER):
    case FAILURE(ACTION_TYPES.CREATE_TASKUSER):
    case FAILURE(ACTION_TYPES.UPDATE_TASKUSER):
    case FAILURE(ACTION_TYPES.DELETE_TASKUSER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKUSER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKUSER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TASKUSER):
    case SUCCESS(ACTION_TYPES.UPDATE_TASKUSER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TASKUSER):
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

const apiUrl = 'services/microprocess/api/task-users';

// Actions

export const getEntities: ICrudGetAllAction<ITaskUser> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TASKUSER_LIST,
    payload: axios.get<ITaskUser>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITaskUser> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TASKUSER,
    payload: axios.get<ITaskUser>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITaskUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TASKUSER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITaskUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TASKUSER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITaskUser> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TASKUSER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
