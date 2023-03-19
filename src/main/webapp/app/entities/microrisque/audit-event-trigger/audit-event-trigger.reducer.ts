import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAuditEventTrigger, defaultValue } from 'app/shared/model/microrisque/audit-event-trigger.model';

export const ACTION_TYPES = {
  FETCH_AUDITEVENTTRIGGER_LIST: 'auditEventTrigger/FETCH_AUDITEVENTTRIGGER_LIST',
  FETCH_AUDITEVENTTRIGGER: 'auditEventTrigger/FETCH_AUDITEVENTTRIGGER',
  CREATE_AUDITEVENTTRIGGER: 'auditEventTrigger/CREATE_AUDITEVENTTRIGGER',
  UPDATE_AUDITEVENTTRIGGER: 'auditEventTrigger/UPDATE_AUDITEVENTTRIGGER',
  DELETE_AUDITEVENTTRIGGER: 'auditEventTrigger/DELETE_AUDITEVENTTRIGGER',
  RESET: 'auditEventTrigger/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAuditEventTrigger>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AuditEventTriggerState = Readonly<typeof initialState>;

// Reducer

export default (state: AuditEventTriggerState = initialState, action): AuditEventTriggerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AUDITEVENTTRIGGER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AUDITEVENTTRIGGER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_AUDITEVENTTRIGGER):
    case REQUEST(ACTION_TYPES.UPDATE_AUDITEVENTTRIGGER):
    case REQUEST(ACTION_TYPES.DELETE_AUDITEVENTTRIGGER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AUDITEVENTTRIGGER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AUDITEVENTTRIGGER):
    case FAILURE(ACTION_TYPES.CREATE_AUDITEVENTTRIGGER):
    case FAILURE(ACTION_TYPES.UPDATE_AUDITEVENTTRIGGER):
    case FAILURE(ACTION_TYPES.DELETE_AUDITEVENTTRIGGER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITEVENTTRIGGER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITEVENTTRIGGER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_AUDITEVENTTRIGGER):
    case SUCCESS(ACTION_TYPES.UPDATE_AUDITEVENTTRIGGER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_AUDITEVENTTRIGGER):
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

const apiUrl = 'services/microrisque/api/audit-event-triggers';

// Actions

export const getEntities: ICrudGetAllAction<IAuditEventTrigger> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITEVENTTRIGGER_LIST,
    payload: axios.get<IAuditEventTrigger>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAuditEventTrigger> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITEVENTTRIGGER,
    payload: axios.get<IAuditEventTrigger>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAuditEventTrigger> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AUDITEVENTTRIGGER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAuditEventTrigger> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AUDITEVENTTRIGGER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAuditEventTrigger> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AUDITEVENTTRIGGER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
