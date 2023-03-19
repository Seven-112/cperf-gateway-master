import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAudit, defaultValue } from 'app/shared/model/microrisque/audit.model';

export const ACTION_TYPES = {
  FETCH_AUDIT_LIST: 'audit/FETCH_AUDIT_LIST',
  FETCH_AUDIT: 'audit/FETCH_AUDIT',
  CREATE_AUDIT: 'audit/CREATE_AUDIT',
  UPDATE_AUDIT: 'audit/UPDATE_AUDIT',
  DELETE_AUDIT: 'audit/DELETE_AUDIT',
  RESET: 'audit/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAudit>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AuditState = Readonly<typeof initialState>;

// Reducer

export default (state: AuditState = initialState, action): AuditState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AUDIT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AUDIT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_AUDIT):
    case REQUEST(ACTION_TYPES.UPDATE_AUDIT):
    case REQUEST(ACTION_TYPES.DELETE_AUDIT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AUDIT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AUDIT):
    case FAILURE(ACTION_TYPES.CREATE_AUDIT):
    case FAILURE(ACTION_TYPES.UPDATE_AUDIT):
    case FAILURE(ACTION_TYPES.DELETE_AUDIT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDIT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDIT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_AUDIT):
    case SUCCESS(ACTION_TYPES.UPDATE_AUDIT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_AUDIT):
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

const apiUrl = 'services/microrisque/api/audits';

// Actions

export const getEntities: ICrudGetAllAction<IAudit> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AUDIT_LIST,
    payload: axios.get<IAudit>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAudit> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AUDIT,
    payload: axios.get<IAudit>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAudit> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AUDIT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAudit> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AUDIT,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAudit> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AUDIT,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
