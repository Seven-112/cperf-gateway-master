import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProjectPublicHoliday, defaultValue } from 'app/shared/model/microproject/project-public-holiday.model';

export const ACTION_TYPES = {
  FETCH_PROJECTPUBLICHOLIDAY_LIST: 'projectPublicHoliday/FETCH_PROJECTPUBLICHOLIDAY_LIST',
  FETCH_PROJECTPUBLICHOLIDAY: 'projectPublicHoliday/FETCH_PROJECTPUBLICHOLIDAY',
  CREATE_PROJECTPUBLICHOLIDAY: 'projectPublicHoliday/CREATE_PROJECTPUBLICHOLIDAY',
  UPDATE_PROJECTPUBLICHOLIDAY: 'projectPublicHoliday/UPDATE_PROJECTPUBLICHOLIDAY',
  DELETE_PROJECTPUBLICHOLIDAY: 'projectPublicHoliday/DELETE_PROJECTPUBLICHOLIDAY',
  RESET: 'projectPublicHoliday/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectPublicHoliday>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectPublicHolidayState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectPublicHolidayState = initialState, action): ProjectPublicHolidayState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTPUBLICHOLIDAY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTPUBLICHOLIDAY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTPUBLICHOLIDAY):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTPUBLICHOLIDAY):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTPUBLICHOLIDAY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTPUBLICHOLIDAY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTPUBLICHOLIDAY):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTPUBLICHOLIDAY):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTPUBLICHOLIDAY):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTPUBLICHOLIDAY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTPUBLICHOLIDAY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTPUBLICHOLIDAY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTPUBLICHOLIDAY):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTPUBLICHOLIDAY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTPUBLICHOLIDAY):
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

const apiUrl = 'services/microproject/api/project-public-holidays';

// Actions

export const getEntities: ICrudGetAllAction<IProjectPublicHoliday> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTPUBLICHOLIDAY_LIST,
    payload: axios.get<IProjectPublicHoliday>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectPublicHoliday> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTPUBLICHOLIDAY,
    payload: axios.get<IProjectPublicHoliday>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectPublicHoliday> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTPUBLICHOLIDAY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectPublicHoliday> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTPUBLICHOLIDAY,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectPublicHoliday> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTPUBLICHOLIDAY,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
