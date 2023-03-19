import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IEngeneering, defaultValue } from 'app/shared/model/microstock/engeneering.model';

export const ACTION_TYPES = {
  FETCH_ENGENEERING_LIST: 'engeneering/FETCH_ENGENEERING_LIST',
  FETCH_ENGENEERING: 'engeneering/FETCH_ENGENEERING',
  CREATE_ENGENEERING: 'engeneering/CREATE_ENGENEERING',
  UPDATE_ENGENEERING: 'engeneering/UPDATE_ENGENEERING',
  DELETE_ENGENEERING: 'engeneering/DELETE_ENGENEERING',
  RESET: 'engeneering/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEngeneering>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type EngeneeringState = Readonly<typeof initialState>;

// Reducer

export default (state: EngeneeringState = initialState, action): EngeneeringState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ENGENEERING_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ENGENEERING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_ENGENEERING):
    case REQUEST(ACTION_TYPES.UPDATE_ENGENEERING):
    case REQUEST(ACTION_TYPES.DELETE_ENGENEERING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_ENGENEERING_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ENGENEERING):
    case FAILURE(ACTION_TYPES.CREATE_ENGENEERING):
    case FAILURE(ACTION_TYPES.UPDATE_ENGENEERING):
    case FAILURE(ACTION_TYPES.DELETE_ENGENEERING):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ENGENEERING_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_ENGENEERING):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_ENGENEERING):
    case SUCCESS(ACTION_TYPES.UPDATE_ENGENEERING):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_ENGENEERING):
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

const apiUrl = 'services/microstock/api/engeneerings';

// Actions

export const getEntities: ICrudGetAllAction<IEngeneering> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ENGENEERING_LIST,
    payload: axios.get<IEngeneering>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IEngeneering> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ENGENEERING,
    payload: axios.get<IEngeneering>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IEngeneering> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ENGENEERING,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IEngeneering> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ENGENEERING,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEngeneering> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ENGENEERING,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
