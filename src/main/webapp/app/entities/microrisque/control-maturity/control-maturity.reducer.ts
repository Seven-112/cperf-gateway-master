import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IControlMaturity, defaultValue } from 'app/shared/model/microrisque/control-maturity.model';

export const ACTION_TYPES = {
  FETCH_CONTROLMATURITY_LIST: 'controlMaturity/FETCH_CONTROLMATURITY_LIST',
  FETCH_CONTROLMATURITY: 'controlMaturity/FETCH_CONTROLMATURITY',
  CREATE_CONTROLMATURITY: 'controlMaturity/CREATE_CONTROLMATURITY',
  UPDATE_CONTROLMATURITY: 'controlMaturity/UPDATE_CONTROLMATURITY',
  DELETE_CONTROLMATURITY: 'controlMaturity/DELETE_CONTROLMATURITY',
  RESET: 'controlMaturity/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IControlMaturity>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ControlMaturityState = Readonly<typeof initialState>;

// Reducer

export default (state: ControlMaturityState = initialState, action): ControlMaturityState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CONTROLMATURITY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CONTROLMATURITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CONTROLMATURITY):
    case REQUEST(ACTION_TYPES.UPDATE_CONTROLMATURITY):
    case REQUEST(ACTION_TYPES.DELETE_CONTROLMATURITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CONTROLMATURITY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CONTROLMATURITY):
    case FAILURE(ACTION_TYPES.CREATE_CONTROLMATURITY):
    case FAILURE(ACTION_TYPES.UPDATE_CONTROLMATURITY):
    case FAILURE(ACTION_TYPES.DELETE_CONTROLMATURITY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONTROLMATURITY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONTROLMATURITY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CONTROLMATURITY):
    case SUCCESS(ACTION_TYPES.UPDATE_CONTROLMATURITY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CONTROLMATURITY):
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

const apiUrl = 'services/microrisque/api/control-maturities';

// Actions

export const getEntities: ICrudGetAllAction<IControlMaturity> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CONTROLMATURITY_LIST,
    payload: axios.get<IControlMaturity>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IControlMaturity> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CONTROLMATURITY,
    payload: axios.get<IControlMaturity>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IControlMaturity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CONTROLMATURITY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IControlMaturity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CONTROLMATURITY,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IControlMaturity> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CONTROLMATURITY,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
