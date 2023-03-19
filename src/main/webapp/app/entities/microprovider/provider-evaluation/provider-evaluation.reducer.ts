import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProviderEvaluation, defaultValue } from 'app/shared/model/microprovider/provider-evaluation.model';

export const ACTION_TYPES = {
  FETCH_PROVIDEREVALUATION_LIST: 'providerEvaluation/FETCH_PROVIDEREVALUATION_LIST',
  FETCH_PROVIDEREVALUATION: 'providerEvaluation/FETCH_PROVIDEREVALUATION',
  CREATE_PROVIDEREVALUATION: 'providerEvaluation/CREATE_PROVIDEREVALUATION',
  UPDATE_PROVIDEREVALUATION: 'providerEvaluation/UPDATE_PROVIDEREVALUATION',
  DELETE_PROVIDEREVALUATION: 'providerEvaluation/DELETE_PROVIDEREVALUATION',
  SET_BLOB: 'providerEvaluation/SET_BLOB',
  RESET: 'providerEvaluation/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProviderEvaluation>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProviderEvaluationState = Readonly<typeof initialState>;

// Reducer

export default (state: ProviderEvaluationState = initialState, action): ProviderEvaluationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROVIDEREVALUATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROVIDEREVALUATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROVIDEREVALUATION):
    case REQUEST(ACTION_TYPES.UPDATE_PROVIDEREVALUATION):
    case REQUEST(ACTION_TYPES.DELETE_PROVIDEREVALUATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROVIDEREVALUATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROVIDEREVALUATION):
    case FAILURE(ACTION_TYPES.CREATE_PROVIDEREVALUATION):
    case FAILURE(ACTION_TYPES.UPDATE_PROVIDEREVALUATION):
    case FAILURE(ACTION_TYPES.DELETE_PROVIDEREVALUATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROVIDEREVALUATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROVIDEREVALUATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROVIDEREVALUATION):
    case SUCCESS(ACTION_TYPES.UPDATE_PROVIDEREVALUATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROVIDEREVALUATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'services/microprovider/api/provider-evaluations';

// Actions

export const getEntities: ICrudGetAllAction<IProviderEvaluation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROVIDEREVALUATION_LIST,
    payload: axios.get<IProviderEvaluation>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProviderEvaluation> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROVIDEREVALUATION,
    payload: axios.get<IProviderEvaluation>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProviderEvaluation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROVIDEREVALUATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProviderEvaluation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROVIDEREVALUATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProviderEvaluation> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROVIDEREVALUATION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
