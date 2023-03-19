import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQueryUser, defaultValue } from 'app/shared/model/qmanager/query-user.model';

export const ACTION_TYPES = {
  FETCH_QUERYUSER_LIST: 'queryUser/FETCH_QUERYUSER_LIST',
  FETCH_QUERYUSER: 'queryUser/FETCH_QUERYUSER',
  CREATE_QUERYUSER: 'queryUser/CREATE_QUERYUSER',
  UPDATE_QUERYUSER: 'queryUser/UPDATE_QUERYUSER',
  DELETE_QUERYUSER: 'queryUser/DELETE_QUERYUSER',
  RESET: 'queryUser/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryUser>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryUserState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryUserState = initialState, action): QueryUserState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYUSER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYUSER):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYUSER):
    case REQUEST(ACTION_TYPES.DELETE_QUERYUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYUSER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYUSER):
    case FAILURE(ACTION_TYPES.CREATE_QUERYUSER):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYUSER):
    case FAILURE(ACTION_TYPES.DELETE_QUERYUSER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYUSER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYUSER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYUSER):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYUSER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYUSER):
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

const apiUrl = 'services/qmanager/api/query-users';

// Actions

export const getEntities: ICrudGetAllAction<IQueryUser> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYUSER_LIST,
    payload: axios.get<IQueryUser>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryUser> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYUSER,
    payload: axios.get<IQueryUser>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYUSER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYUSER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryUser> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYUSER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
