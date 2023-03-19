import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQueryUserValidator, defaultValue } from 'app/shared/model/qmanager/query-user-validator.model';

export const ACTION_TYPES = {
  FETCH_QUERYUSERVALIDATOR_LIST: 'queryUserValidator/FETCH_QUERYUSERVALIDATOR_LIST',
  FETCH_QUERYUSERVALIDATOR: 'queryUserValidator/FETCH_QUERYUSERVALIDATOR',
  CREATE_QUERYUSERVALIDATOR: 'queryUserValidator/CREATE_QUERYUSERVALIDATOR',
  UPDATE_QUERYUSERVALIDATOR: 'queryUserValidator/UPDATE_QUERYUSERVALIDATOR',
  DELETE_QUERYUSERVALIDATOR: 'queryUserValidator/DELETE_QUERYUSERVALIDATOR',
  RESET: 'queryUserValidator/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryUserValidator>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryUserValidatorState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryUserValidatorState = initialState, action): QueryUserValidatorState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYUSERVALIDATOR_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYUSERVALIDATOR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYUSERVALIDATOR):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYUSERVALIDATOR):
    case REQUEST(ACTION_TYPES.DELETE_QUERYUSERVALIDATOR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYUSERVALIDATOR_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYUSERVALIDATOR):
    case FAILURE(ACTION_TYPES.CREATE_QUERYUSERVALIDATOR):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYUSERVALIDATOR):
    case FAILURE(ACTION_TYPES.DELETE_QUERYUSERVALIDATOR):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYUSERVALIDATOR_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYUSERVALIDATOR):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYUSERVALIDATOR):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYUSERVALIDATOR):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYUSERVALIDATOR):
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

const apiUrl = 'services/qmanager/api/query-user-validators';

// Actions

export const getEntities: ICrudGetAllAction<IQueryUserValidator> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYUSERVALIDATOR_LIST,
    payload: axios.get<IQueryUserValidator>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryUserValidator> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYUSERVALIDATOR,
    payload: axios.get<IQueryUserValidator>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryUserValidator> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYUSERVALIDATOR,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryUserValidator> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYUSERVALIDATOR,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryUserValidator> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYUSERVALIDATOR,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
