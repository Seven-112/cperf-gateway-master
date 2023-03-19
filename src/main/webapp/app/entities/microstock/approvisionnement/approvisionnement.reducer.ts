import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IApprovisionnement, defaultValue } from 'app/shared/model/microstock/approvisionnement.model';

export const ACTION_TYPES = {
  FETCH_APPROVISIONNEMENT_LIST: 'approvisionnement/FETCH_APPROVISIONNEMENT_LIST',
  FETCH_APPROVISIONNEMENT: 'approvisionnement/FETCH_APPROVISIONNEMENT',
  CREATE_APPROVISIONNEMENT: 'approvisionnement/CREATE_APPROVISIONNEMENT',
  UPDATE_APPROVISIONNEMENT: 'approvisionnement/UPDATE_APPROVISIONNEMENT',
  DELETE_APPROVISIONNEMENT: 'approvisionnement/DELETE_APPROVISIONNEMENT',
  RESET: 'approvisionnement/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IApprovisionnement>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ApprovisionnementState = Readonly<typeof initialState>;

// Reducer

export default (state: ApprovisionnementState = initialState, action): ApprovisionnementState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_APPROVISIONNEMENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_APPROVISIONNEMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_APPROVISIONNEMENT):
    case REQUEST(ACTION_TYPES.UPDATE_APPROVISIONNEMENT):
    case REQUEST(ACTION_TYPES.DELETE_APPROVISIONNEMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_APPROVISIONNEMENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_APPROVISIONNEMENT):
    case FAILURE(ACTION_TYPES.CREATE_APPROVISIONNEMENT):
    case FAILURE(ACTION_TYPES.UPDATE_APPROVISIONNEMENT):
    case FAILURE(ACTION_TYPES.DELETE_APPROVISIONNEMENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_APPROVISIONNEMENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_APPROVISIONNEMENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_APPROVISIONNEMENT):
    case SUCCESS(ACTION_TYPES.UPDATE_APPROVISIONNEMENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_APPROVISIONNEMENT):
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

const apiUrl = 'services/microstock/api/approvisionnements';

// Actions

export const getEntities: ICrudGetAllAction<IApprovisionnement> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_APPROVISIONNEMENT_LIST,
    payload: axios.get<IApprovisionnement>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IApprovisionnement> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_APPROVISIONNEMENT,
    payload: axios.get<IApprovisionnement>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IApprovisionnement> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_APPROVISIONNEMENT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IApprovisionnement> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_APPROVISIONNEMENT,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IApprovisionnement> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_APPROVISIONNEMENT,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
