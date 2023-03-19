import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IPrivilege, defaultValue } from 'app/shared/model/privilege.model';

export const ACTION_TYPES = {
  FETCH_PRIVILEGE_LIST: 'privilege/FETCH_PRIVILEGE_LIST',
  FETCH_PRIVILEGE: 'privilege/FETCH_PRIVILEGE',
  CREATE_PRIVILEGE: 'privilege/CREATE_PRIVILEGE',
  UPDATE_PRIVILEGE: 'privilege/UPDATE_PRIVILEGE',
  DELETE_PRIVILEGE: 'privilege/DELETE_PRIVILEGE',
  RESET: 'privilege/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPrivilege>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type PrivilegeState = Readonly<typeof initialState>;

// Reducer

export default (state: PrivilegeState = initialState, action): PrivilegeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PRIVILEGE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PRIVILEGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PRIVILEGE):
    case REQUEST(ACTION_TYPES.UPDATE_PRIVILEGE):
    case REQUEST(ACTION_TYPES.DELETE_PRIVILEGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PRIVILEGE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PRIVILEGE):
    case FAILURE(ACTION_TYPES.CREATE_PRIVILEGE):
    case FAILURE(ACTION_TYPES.UPDATE_PRIVILEGE):
    case FAILURE(ACTION_TYPES.DELETE_PRIVILEGE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PRIVILEGE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PRIVILEGE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PRIVILEGE):
    case SUCCESS(ACTION_TYPES.UPDATE_PRIVILEGE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PRIVILEGE):
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

const apiUrl = 'api/privileges';

// Actions

export const getEntities: ICrudGetAllAction<IPrivilege> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PRIVILEGE_LIST,
    payload: axios.get<IPrivilege>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IPrivilege> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PRIVILEGE,
    payload: axios.get<IPrivilege>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IPrivilege> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PRIVILEGE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPrivilege> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PRIVILEGE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPrivilege> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PRIVILEGE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
