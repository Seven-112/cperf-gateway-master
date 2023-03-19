import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IEventExeption, defaultValue } from 'app/shared/model/microagenda/event-exeption.model';

export const ACTION_TYPES = {
  FETCH_EVENTEXEPTION_LIST: 'eventExeption/FETCH_EVENTEXEPTION_LIST',
  FETCH_EVENTEXEPTION: 'eventExeption/FETCH_EVENTEXEPTION',
  CREATE_EVENTEXEPTION: 'eventExeption/CREATE_EVENTEXEPTION',
  UPDATE_EVENTEXEPTION: 'eventExeption/UPDATE_EVENTEXEPTION',
  DELETE_EVENTEXEPTION: 'eventExeption/DELETE_EVENTEXEPTION',
  RESET: 'eventExeption/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEventExeption>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type EventExeptionState = Readonly<typeof initialState>;

// Reducer

export default (state: EventExeptionState = initialState, action): EventExeptionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_EVENTEXEPTION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EVENTEXEPTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_EVENTEXEPTION):
    case REQUEST(ACTION_TYPES.UPDATE_EVENTEXEPTION):
    case REQUEST(ACTION_TYPES.DELETE_EVENTEXEPTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EVENTEXEPTION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EVENTEXEPTION):
    case FAILURE(ACTION_TYPES.CREATE_EVENTEXEPTION):
    case FAILURE(ACTION_TYPES.UPDATE_EVENTEXEPTION):
    case FAILURE(ACTION_TYPES.DELETE_EVENTEXEPTION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EVENTEXEPTION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_EVENTEXEPTION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EVENTEXEPTION):
    case SUCCESS(ACTION_TYPES.UPDATE_EVENTEXEPTION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_EVENTEXEPTION):
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

const apiUrl = 'services/microagenda/api/event-exeptions';

// Actions

export const getEntities: ICrudGetAllAction<IEventExeption> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_EVENTEXEPTION_LIST,
    payload: axios.get<IEventExeption>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IEventExeption> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EVENTEXEPTION,
    payload: axios.get<IEventExeption>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IEventExeption> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EVENTEXEPTION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IEventExeption> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EVENTEXEPTION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEventExeption> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EVENTEXEPTION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
