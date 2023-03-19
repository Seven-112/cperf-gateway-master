import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IWorkCalender, defaultValue } from 'app/shared/model/work-calender.model';

export const ACTION_TYPES = {
  FETCH_WORKCALENDER_LIST: 'workCalender/FETCH_WORKCALENDER_LIST',
  FETCH_WORKCALENDER: 'workCalender/FETCH_WORKCALENDER',
  CREATE_WORKCALENDER: 'workCalender/CREATE_WORKCALENDER',
  UPDATE_WORKCALENDER: 'workCalender/UPDATE_WORKCALENDER',
  DELETE_WORKCALENDER: 'workCalender/DELETE_WORKCALENDER',
  RESET: 'workCalender/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWorkCalender>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type WorkCalenderState = Readonly<typeof initialState>;

// Reducer

export default (state: WorkCalenderState = initialState, action): WorkCalenderState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_WORKCALENDER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_WORKCALENDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_WORKCALENDER):
    case REQUEST(ACTION_TYPES.UPDATE_WORKCALENDER):
    case REQUEST(ACTION_TYPES.DELETE_WORKCALENDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_WORKCALENDER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_WORKCALENDER):
    case FAILURE(ACTION_TYPES.CREATE_WORKCALENDER):
    case FAILURE(ACTION_TYPES.UPDATE_WORKCALENDER):
    case FAILURE(ACTION_TYPES.DELETE_WORKCALENDER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WORKCALENDER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WORKCALENDER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_WORKCALENDER):
    case SUCCESS(ACTION_TYPES.UPDATE_WORKCALENDER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_WORKCALENDER):
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

const apiUrl = 'services/microprocess/api/work-calenders';

// Actions

export const getEntities: ICrudGetAllAction<IWorkCalender> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_WORKCALENDER_LIST,
  payload: axios.get<IWorkCalender>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IWorkCalender> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_WORKCALENDER,
    payload: axios.get<IWorkCalender>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IWorkCalender> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WORKCALENDER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IWorkCalender> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_WORKCALENDER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IWorkCalender> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_WORKCALENDER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
