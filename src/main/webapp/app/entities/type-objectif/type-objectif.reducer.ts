import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITypeObjectif, defaultValue } from 'app/shared/model/type-objectif.model';

export const ACTION_TYPES = {
  FETCH_TYPEOBJECTIF_LIST: 'typeObjectif/FETCH_TYPEOBJECTIF_LIST',
  FETCH_TYPEOBJECTIF: 'typeObjectif/FETCH_TYPEOBJECTIF',
  CREATE_TYPEOBJECTIF: 'typeObjectif/CREATE_TYPEOBJECTIF',
  UPDATE_TYPEOBJECTIF: 'typeObjectif/UPDATE_TYPEOBJECTIF',
  DELETE_TYPEOBJECTIF: 'typeObjectif/DELETE_TYPEOBJECTIF',
  RESET: 'typeObjectif/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITypeObjectif>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TypeObjectifState = Readonly<typeof initialState>;

// Reducer

export default (state: TypeObjectifState = initialState, action): TypeObjectifState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TYPEOBJECTIF_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TYPEOBJECTIF):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TYPEOBJECTIF):
    case REQUEST(ACTION_TYPES.UPDATE_TYPEOBJECTIF):
    case REQUEST(ACTION_TYPES.DELETE_TYPEOBJECTIF):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TYPEOBJECTIF_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TYPEOBJECTIF):
    case FAILURE(ACTION_TYPES.CREATE_TYPEOBJECTIF):
    case FAILURE(ACTION_TYPES.UPDATE_TYPEOBJECTIF):
    case FAILURE(ACTION_TYPES.DELETE_TYPEOBJECTIF):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TYPEOBJECTIF_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TYPEOBJECTIF):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TYPEOBJECTIF):
    case SUCCESS(ACTION_TYPES.UPDATE_TYPEOBJECTIF):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TYPEOBJECTIF):
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

const apiUrl = 'api/type-objectifs';

// Actions

export const getEntities: ICrudGetAllAction<ITypeObjectif> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TYPEOBJECTIF_LIST,
    payload: axios.get<ITypeObjectif>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITypeObjectif> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TYPEOBJECTIF,
    payload: axios.get<ITypeObjectif>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITypeObjectif> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TYPEOBJECTIF,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITypeObjectif> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TYPEOBJECTIF,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITypeObjectif> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TYPEOBJECTIF,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
