import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IChangement, defaultValue } from 'app/shared/model/microstock/changement.model';

export const ACTION_TYPES = {
  FETCH_CHANGEMENT_LIST: 'changement/FETCH_CHANGEMENT_LIST',
  FETCH_CHANGEMENT: 'changement/FETCH_CHANGEMENT',
  CREATE_CHANGEMENT: 'changement/CREATE_CHANGEMENT',
  UPDATE_CHANGEMENT: 'changement/UPDATE_CHANGEMENT',
  DELETE_CHANGEMENT: 'changement/DELETE_CHANGEMENT',
  RESET: 'changement/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IChangement>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ChangementState = Readonly<typeof initialState>;

// Reducer

export default (state: ChangementState = initialState, action): ChangementState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CHANGEMENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CHANGEMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CHANGEMENT):
    case REQUEST(ACTION_TYPES.UPDATE_CHANGEMENT):
    case REQUEST(ACTION_TYPES.DELETE_CHANGEMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CHANGEMENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CHANGEMENT):
    case FAILURE(ACTION_TYPES.CREATE_CHANGEMENT):
    case FAILURE(ACTION_TYPES.UPDATE_CHANGEMENT):
    case FAILURE(ACTION_TYPES.DELETE_CHANGEMENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CHANGEMENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_CHANGEMENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CHANGEMENT):
    case SUCCESS(ACTION_TYPES.UPDATE_CHANGEMENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CHANGEMENT):
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

const apiUrl = 'services/microstock/api/changements';

// Actions

export const getEntities: ICrudGetAllAction<IChangement> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CHANGEMENT_LIST,
    payload: axios.get<IChangement>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IChangement> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CHANGEMENT,
    payload: axios.get<IChangement>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IChangement> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CHANGEMENT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IChangement> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CHANGEMENT,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IChangement> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CHANGEMENT,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
