import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IPublicHoliday, defaultValue } from 'app/shared/model/public-holiday.model';

export const ACTION_TYPES = {
  FETCH_PUBLICHOLIDAY_LIST: 'publicHoliday/FETCH_PUBLICHOLIDAY_LIST',
  FETCH_PUBLICHOLIDAY: 'publicHoliday/FETCH_PUBLICHOLIDAY',
  CREATE_PUBLICHOLIDAY: 'publicHoliday/CREATE_PUBLICHOLIDAY',
  UPDATE_PUBLICHOLIDAY: 'publicHoliday/UPDATE_PUBLICHOLIDAY',
  DELETE_PUBLICHOLIDAY: 'publicHoliday/DELETE_PUBLICHOLIDAY',
  RESET: 'publicHoliday/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPublicHoliday>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type PublicHolidayState = Readonly<typeof initialState>;

// Reducer

export default (state: PublicHolidayState = initialState, action): PublicHolidayState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PUBLICHOLIDAY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PUBLICHOLIDAY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PUBLICHOLIDAY):
    case REQUEST(ACTION_TYPES.UPDATE_PUBLICHOLIDAY):
    case REQUEST(ACTION_TYPES.DELETE_PUBLICHOLIDAY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PUBLICHOLIDAY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PUBLICHOLIDAY):
    case FAILURE(ACTION_TYPES.CREATE_PUBLICHOLIDAY):
    case FAILURE(ACTION_TYPES.UPDATE_PUBLICHOLIDAY):
    case FAILURE(ACTION_TYPES.DELETE_PUBLICHOLIDAY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PUBLICHOLIDAY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PUBLICHOLIDAY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PUBLICHOLIDAY):
    case SUCCESS(ACTION_TYPES.UPDATE_PUBLICHOLIDAY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PUBLICHOLIDAY):
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

const apiUrl = 'services/microprocess/api/public-holidays';

// Actions

export const getEntities: ICrudGetAllAction<IPublicHoliday> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PUBLICHOLIDAY_LIST,
  payload: axios.get<IPublicHoliday>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IPublicHoliday> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PUBLICHOLIDAY,
    payload: axios.get<IPublicHoliday>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IPublicHoliday> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PUBLICHOLIDAY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPublicHoliday> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PUBLICHOLIDAY,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPublicHoliday> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PUBLICHOLIDAY,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
