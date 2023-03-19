import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IEventTrigger, defaultValue } from 'app/shared/model/microprocess/event-trigger.model';

export const ACTION_TYPES = {
  FETCH_EVENTTRIGGER_LIST: 'eventTrigger/FETCH_EVENTTRIGGER_LIST',
  FETCH_EVENTTRIGGER: 'eventTrigger/FETCH_EVENTTRIGGER',
  CREATE_EVENTTRIGGER: 'eventTrigger/CREATE_EVENTTRIGGER',
  UPDATE_EVENTTRIGGER: 'eventTrigger/UPDATE_EVENTTRIGGER',
  DELETE_EVENTTRIGGER: 'eventTrigger/DELETE_EVENTTRIGGER',
  RESET: 'eventTrigger/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEventTrigger>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type EventTriggerState = Readonly<typeof initialState>;

// Reducer

export default (state: EventTriggerState = initialState, action): EventTriggerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_EVENTTRIGGER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EVENTTRIGGER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_EVENTTRIGGER):
    case REQUEST(ACTION_TYPES.UPDATE_EVENTTRIGGER):
    case REQUEST(ACTION_TYPES.DELETE_EVENTTRIGGER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EVENTTRIGGER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EVENTTRIGGER):
    case FAILURE(ACTION_TYPES.CREATE_EVENTTRIGGER):
    case FAILURE(ACTION_TYPES.UPDATE_EVENTTRIGGER):
    case FAILURE(ACTION_TYPES.DELETE_EVENTTRIGGER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EVENTTRIGGER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_EVENTTRIGGER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EVENTTRIGGER):
    case SUCCESS(ACTION_TYPES.UPDATE_EVENTTRIGGER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_EVENTTRIGGER):
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

const apiUrl = 'services/microprocess/api/event-triggers';

// Actions

export const getEntities: ICrudGetAllAction<IEventTrigger> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_EVENTTRIGGER_LIST,
    payload: axios.get<IEventTrigger>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IEventTrigger> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EVENTTRIGGER,
    payload: axios.get<IEventTrigger>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IEventTrigger> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EVENTTRIGGER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IEventTrigger> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EVENTTRIGGER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEventTrigger> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EVENTTRIGGER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
