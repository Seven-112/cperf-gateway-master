import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IAuditUser, defaultValue } from 'app/shared/model/microrisque/audit-user.model';

export const ACTION_TYPES = {
  FETCH_AUDITUSER_LIST: 'auditUser/FETCH_AUDITUSER_LIST',
  FETCH_AUDITUSER: 'auditUser/FETCH_AUDITUSER',
  CREATE_AUDITUSER: 'auditUser/CREATE_AUDITUSER',
  UPDATE_AUDITUSER: 'auditUser/UPDATE_AUDITUSER',
  DELETE_AUDITUSER: 'auditUser/DELETE_AUDITUSER',
  RESET: 'auditUser/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAuditUser>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AuditUserState = Readonly<typeof initialState>;

// Reducer

export default (state: AuditUserState = initialState, action): AuditUserState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AUDITUSER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AUDITUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_AUDITUSER):
    case REQUEST(ACTION_TYPES.UPDATE_AUDITUSER):
    case REQUEST(ACTION_TYPES.DELETE_AUDITUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AUDITUSER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AUDITUSER):
    case FAILURE(ACTION_TYPES.CREATE_AUDITUSER):
    case FAILURE(ACTION_TYPES.UPDATE_AUDITUSER):
    case FAILURE(ACTION_TYPES.DELETE_AUDITUSER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITUSER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITUSER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_AUDITUSER):
    case SUCCESS(ACTION_TYPES.UPDATE_AUDITUSER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_AUDITUSER):
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

const apiUrl = 'services/microrisque/api/audit-users';

// Actions

export const getEntities: ICrudGetAllAction<IAuditUser> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITUSER_LIST,
    payload: axios.get<IAuditUser>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAuditUser> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITUSER,
    payload: axios.get<IAuditUser>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAuditUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AUDITUSER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAuditUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AUDITUSER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAuditUser> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AUDITUSER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
