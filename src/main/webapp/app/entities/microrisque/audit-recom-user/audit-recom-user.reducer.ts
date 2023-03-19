import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IAuditRecomUser, defaultValue } from 'app/shared/model/microrisque/audit-recom-user.model';

export const ACTION_TYPES = {
  FETCH_AUDITRECOMUSER_LIST: 'auditRecomUser/FETCH_AUDITRECOMUSER_LIST',
  FETCH_AUDITRECOMUSER: 'auditRecomUser/FETCH_AUDITRECOMUSER',
  CREATE_AUDITRECOMUSER: 'auditRecomUser/CREATE_AUDITRECOMUSER',
  UPDATE_AUDITRECOMUSER: 'auditRecomUser/UPDATE_AUDITRECOMUSER',
  DELETE_AUDITRECOMUSER: 'auditRecomUser/DELETE_AUDITRECOMUSER',
  RESET: 'auditRecomUser/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAuditRecomUser>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AuditRecomUserState = Readonly<typeof initialState>;

// Reducer

export default (state: AuditRecomUserState = initialState, action): AuditRecomUserState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AUDITRECOMUSER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AUDITRECOMUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_AUDITRECOMUSER):
    case REQUEST(ACTION_TYPES.UPDATE_AUDITRECOMUSER):
    case REQUEST(ACTION_TYPES.DELETE_AUDITRECOMUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AUDITRECOMUSER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AUDITRECOMUSER):
    case FAILURE(ACTION_TYPES.CREATE_AUDITRECOMUSER):
    case FAILURE(ACTION_TYPES.UPDATE_AUDITRECOMUSER):
    case FAILURE(ACTION_TYPES.DELETE_AUDITRECOMUSER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITRECOMUSER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITRECOMUSER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_AUDITRECOMUSER):
    case SUCCESS(ACTION_TYPES.UPDATE_AUDITRECOMUSER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_AUDITRECOMUSER):
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

const apiUrl = 'services/microrisque/api/audit-recom-users';

// Actions

export const getEntities: ICrudGetAllAction<IAuditRecomUser> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITRECOMUSER_LIST,
    payload: axios.get<IAuditRecomUser>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAuditRecomUser> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITRECOMUSER,
    payload: axios.get<IAuditRecomUser>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAuditRecomUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AUDITRECOMUSER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAuditRecomUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AUDITRECOMUSER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAuditRecomUser> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AUDITRECOMUSER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
