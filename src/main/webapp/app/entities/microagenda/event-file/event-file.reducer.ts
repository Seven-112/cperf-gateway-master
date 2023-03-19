import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IEventFile, defaultValue } from 'app/shared/model/microagenda/event-file.model';

export const ACTION_TYPES = {
  FETCH_EVENTFILE_LIST: 'eventFile/FETCH_EVENTFILE_LIST',
  FETCH_EVENTFILE: 'eventFile/FETCH_EVENTFILE',
  CREATE_EVENTFILE: 'eventFile/CREATE_EVENTFILE',
  UPDATE_EVENTFILE: 'eventFile/UPDATE_EVENTFILE',
  DELETE_EVENTFILE: 'eventFile/DELETE_EVENTFILE',
  RESET: 'eventFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEventFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type EventFileState = Readonly<typeof initialState>;

// Reducer

export default (state: EventFileState = initialState, action): EventFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_EVENTFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EVENTFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_EVENTFILE):
    case REQUEST(ACTION_TYPES.UPDATE_EVENTFILE):
    case REQUEST(ACTION_TYPES.DELETE_EVENTFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EVENTFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EVENTFILE):
    case FAILURE(ACTION_TYPES.CREATE_EVENTFILE):
    case FAILURE(ACTION_TYPES.UPDATE_EVENTFILE):
    case FAILURE(ACTION_TYPES.DELETE_EVENTFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EVENTFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_EVENTFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EVENTFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_EVENTFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_EVENTFILE):
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

const apiUrl = 'services/microagenda/api/event-files';

// Actions

export const getEntities: ICrudGetAllAction<IEventFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_EVENTFILE_LIST,
    payload: axios.get<IEventFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IEventFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EVENTFILE,
    payload: axios.get<IEventFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IEventFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EVENTFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IEventFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EVENTFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEventFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EVENTFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
