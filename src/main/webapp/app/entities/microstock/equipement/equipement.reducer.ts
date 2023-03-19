import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IEquipement, defaultValue } from 'app/shared/model/microstock/equipement.model';

export const ACTION_TYPES = {
  FETCH_EQUIPEMENT_LIST: 'equipement/FETCH_EQUIPEMENT_LIST',
  FETCH_EQUIPEMENT: 'equipement/FETCH_EQUIPEMENT',
  CREATE_EQUIPEMENT: 'equipement/CREATE_EQUIPEMENT',
  UPDATE_EQUIPEMENT: 'equipement/UPDATE_EQUIPEMENT',
  DELETE_EQUIPEMENT: 'equipement/DELETE_EQUIPEMENT',
  RESET: 'equipement/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEquipement>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type EquipementState = Readonly<typeof initialState>;

// Reducer

export default (state: EquipementState = initialState, action): EquipementState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_EQUIPEMENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EQUIPEMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_EQUIPEMENT):
    case REQUEST(ACTION_TYPES.UPDATE_EQUIPEMENT):
    case REQUEST(ACTION_TYPES.DELETE_EQUIPEMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EQUIPEMENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EQUIPEMENT):
    case FAILURE(ACTION_TYPES.CREATE_EQUIPEMENT):
    case FAILURE(ACTION_TYPES.UPDATE_EQUIPEMENT):
    case FAILURE(ACTION_TYPES.DELETE_EQUIPEMENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EQUIPEMENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_EQUIPEMENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EQUIPEMENT):
    case SUCCESS(ACTION_TYPES.UPDATE_EQUIPEMENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_EQUIPEMENT):
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

const apiUrl = 'services/microstock/api/equipements';

// Actions

export const getEntities: ICrudGetAllAction<IEquipement> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_EQUIPEMENT_LIST,
    payload: axios.get<IEquipement>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IEquipement> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EQUIPEMENT,
    payload: axios.get<IEquipement>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IEquipement> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EQUIPEMENT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IEquipement> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EQUIPEMENT,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEquipement> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EQUIPEMENT,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
