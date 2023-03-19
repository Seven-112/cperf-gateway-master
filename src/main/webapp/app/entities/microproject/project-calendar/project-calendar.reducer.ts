import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProjectCalendar, defaultValue } from 'app/shared/model/microproject/project-calendar.model';

export const ACTION_TYPES = {
  FETCH_PROJECTCALENDAR_LIST: 'projectCalendar/FETCH_PROJECTCALENDAR_LIST',
  FETCH_PROJECTCALENDAR: 'projectCalendar/FETCH_PROJECTCALENDAR',
  CREATE_PROJECTCALENDAR: 'projectCalendar/CREATE_PROJECTCALENDAR',
  UPDATE_PROJECTCALENDAR: 'projectCalendar/UPDATE_PROJECTCALENDAR',
  DELETE_PROJECTCALENDAR: 'projectCalendar/DELETE_PROJECTCALENDAR',
  RESET: 'projectCalendar/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectCalendar>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectCalendarState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectCalendarState = initialState, action): ProjectCalendarState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCALENDAR_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCALENDAR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTCALENDAR):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTCALENDAR):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTCALENDAR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCALENDAR_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCALENDAR):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTCALENDAR):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTCALENDAR):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTCALENDAR):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCALENDAR_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCALENDAR):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTCALENDAR):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTCALENDAR):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTCALENDAR):
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

const apiUrl = 'services/microproject/api/project-calendars';

// Actions

export const getEntities: ICrudGetAllAction<IProjectCalendar> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCALENDAR_LIST,
    payload: axios.get<IProjectCalendar>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectCalendar> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCALENDAR,
    payload: axios.get<IProjectCalendar>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectCalendar> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTCALENDAR,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectCalendar> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTCALENDAR,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectCalendar> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTCALENDAR,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
