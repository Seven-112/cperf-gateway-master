import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IFonction, defaultValue } from 'app/shared/model/fonction.model';

export const ACTION_TYPES = {
  FETCH_FONCTION_LIST: 'fonction/FETCH_FONCTION_LIST',
  FETCH_FONCTION_ALL: 'fonction/FETCH_FONCTION_ALL',
  FETCH_FONCTION: 'fonction/FETCH_FONCTION',
  CREATE_FONCTION: 'fonction/CREATE_FONCTION',
  UPDATE_FONCTION: 'fonction/UPDATE_FONCTION',
  DELETE_FONCTION: 'fonction/DELETE_FONCTION',
  RESET: 'fonction/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IFonction>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type FonctionState = Readonly<typeof initialState>;

// Reducer

export default (state: FonctionState = initialState, action): FonctionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_FONCTION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_FONCTION):
    case REQUEST(ACTION_TYPES.FETCH_FONCTION_ALL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_FONCTION):
    case REQUEST(ACTION_TYPES.UPDATE_FONCTION):
    case REQUEST(ACTION_TYPES.DELETE_FONCTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_FONCTION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_FONCTION):
    case FAILURE(ACTION_TYPES.CREATE_FONCTION):
    case FAILURE(ACTION_TYPES.UPDATE_FONCTION):
    case FAILURE(ACTION_TYPES.DELETE_FONCTION):
    case FAILURE(ACTION_TYPES.FETCH_FONCTION_ALL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FONCTION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_FONCTION_ALL):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FONCTION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_FONCTION):
    case SUCCESS(ACTION_TYPES.UPDATE_FONCTION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_FONCTION):
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

const apiUrl = 'api/fonctions';

// Actions

export const getEntities: ICrudGetAllAction<IFonction> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_FONCTION_LIST,
    payload: axios.get<IFonction>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getAllEntities: ICrudGetAllAction<IFonction> = () => {
  const requestUrl = `${apiUrl}/all`;
  return {
    type: ACTION_TYPES.FETCH_FONCTION_ALL,
    payload: axios.get<IFonction>(`${requestUrl}`),
  };
};

export const getEntity: ICrudGetAction<IFonction> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_FONCTION,
    payload: axios.get<IFonction>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IFonction> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_FONCTION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getAllEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IFonction> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_FONCTION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IFonction> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_FONCTION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getAllEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
