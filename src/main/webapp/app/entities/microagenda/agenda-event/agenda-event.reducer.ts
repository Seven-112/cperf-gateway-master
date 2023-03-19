import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAgendaEvent, defaultValue } from 'app/shared/model/microagenda/agenda-event.model';

export const ACTION_TYPES = {
  FETCH_AGENDAEVENT_LIST: 'agendaEvent/FETCH_AGENDAEVENT_LIST',
  FETCH_AGENDAEVENT: 'agendaEvent/FETCH_AGENDAEVENT',
  CREATE_AGENDAEVENT: 'agendaEvent/CREATE_AGENDAEVENT',
  UPDATE_AGENDAEVENT: 'agendaEvent/UPDATE_AGENDAEVENT',
  DELETE_AGENDAEVENT: 'agendaEvent/DELETE_AGENDAEVENT',
  SET_BLOB: 'agendaEvent/SET_BLOB',
  RESET: 'agendaEvent/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAgendaEvent>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AgendaEventState = Readonly<typeof initialState>;

// Reducer

export default (state: AgendaEventState = initialState, action): AgendaEventState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AGENDAEVENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AGENDAEVENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_AGENDAEVENT):
    case REQUEST(ACTION_TYPES.UPDATE_AGENDAEVENT):
    case REQUEST(ACTION_TYPES.DELETE_AGENDAEVENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AGENDAEVENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AGENDAEVENT):
    case FAILURE(ACTION_TYPES.CREATE_AGENDAEVENT):
    case FAILURE(ACTION_TYPES.UPDATE_AGENDAEVENT):
    case FAILURE(ACTION_TYPES.DELETE_AGENDAEVENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AGENDAEVENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_AGENDAEVENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_AGENDAEVENT):
    case SUCCESS(ACTION_TYPES.UPDATE_AGENDAEVENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_AGENDAEVENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'services/microagenda/api/agenda-events';

// Actions

export const getEntities: ICrudGetAllAction<IAgendaEvent> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AGENDAEVENT_LIST,
    payload: axios.get<IAgendaEvent>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAgendaEvent> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AGENDAEVENT,
    payload: axios.get<IAgendaEvent>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAgendaEvent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AGENDAEVENT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAgendaEvent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AGENDAEVENT,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAgendaEvent> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AGENDAEVENT,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
