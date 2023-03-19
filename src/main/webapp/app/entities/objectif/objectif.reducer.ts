import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IObjectif, defaultValue } from 'app/shared/model/objectif.model';

export const ACTION_TYPES = {
  FETCH_OBJECTIF_LIST: 'objectif/FETCH_OBJECTIF_LIST',
  FETCH_OBJECTIF: 'objectif/FETCH_OBJECTIF',
  CREATE_OBJECTIF: 'objectif/CREATE_OBJECTIF',
  UPDATE_OBJECTIF: 'objectif/UPDATE_OBJECTIF',
  DELETE_OBJECTIF: 'objectif/DELETE_OBJECTIF',
  RESET: 'objectif/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IObjectif>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ObjectifState = Readonly<typeof initialState>;

// Reducer

export default (state: ObjectifState = initialState, action): ObjectifState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_OBJECTIF_LIST):
    case REQUEST(ACTION_TYPES.FETCH_OBJECTIF):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_OBJECTIF):
    case REQUEST(ACTION_TYPES.UPDATE_OBJECTIF):
    case REQUEST(ACTION_TYPES.DELETE_OBJECTIF):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_OBJECTIF_LIST):
    case FAILURE(ACTION_TYPES.FETCH_OBJECTIF):
    case FAILURE(ACTION_TYPES.CREATE_OBJECTIF):
    case FAILURE(ACTION_TYPES.UPDATE_OBJECTIF):
    case FAILURE(ACTION_TYPES.DELETE_OBJECTIF):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_OBJECTIF_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_OBJECTIF):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_OBJECTIF):
    case SUCCESS(ACTION_TYPES.UPDATE_OBJECTIF):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_OBJECTIF):
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

const apiUrl = 'api/objectifs';

// Actions

export const getEntities: ICrudGetAllAction<IObjectif> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_OBJECTIF_LIST,
    payload: axios.get<IObjectif>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IObjectif> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_OBJECTIF,
    payload: axios.get<IObjectif>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IObjectif> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_OBJECTIF,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IObjectif> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_OBJECTIF,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IObjectif> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_OBJECTIF,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
