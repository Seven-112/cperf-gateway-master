import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProviderExpedition, defaultValue } from 'app/shared/model/microprovider/provider-expedition.model';

export const ACTION_TYPES = {
  FETCH_PROVIDEREXPEDITION_LIST: 'providerExpedition/FETCH_PROVIDEREXPEDITION_LIST',
  FETCH_PROVIDEREXPEDITION: 'providerExpedition/FETCH_PROVIDEREXPEDITION',
  CREATE_PROVIDEREXPEDITION: 'providerExpedition/CREATE_PROVIDEREXPEDITION',
  UPDATE_PROVIDEREXPEDITION: 'providerExpedition/UPDATE_PROVIDEREXPEDITION',
  DELETE_PROVIDEREXPEDITION: 'providerExpedition/DELETE_PROVIDEREXPEDITION',
  RESET: 'providerExpedition/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProviderExpedition>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProviderExpeditionState = Readonly<typeof initialState>;

// Reducer

export default (state: ProviderExpeditionState = initialState, action): ProviderExpeditionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROVIDEREXPEDITION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROVIDEREXPEDITION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROVIDEREXPEDITION):
    case REQUEST(ACTION_TYPES.UPDATE_PROVIDEREXPEDITION):
    case REQUEST(ACTION_TYPES.DELETE_PROVIDEREXPEDITION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROVIDEREXPEDITION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROVIDEREXPEDITION):
    case FAILURE(ACTION_TYPES.CREATE_PROVIDEREXPEDITION):
    case FAILURE(ACTION_TYPES.UPDATE_PROVIDEREXPEDITION):
    case FAILURE(ACTION_TYPES.DELETE_PROVIDEREXPEDITION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROVIDEREXPEDITION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROVIDEREXPEDITION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROVIDEREXPEDITION):
    case SUCCESS(ACTION_TYPES.UPDATE_PROVIDEREXPEDITION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROVIDEREXPEDITION):
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

const apiUrl = 'services/microprovider/api/provider-expeditions';

// Actions

export const getEntities: ICrudGetAllAction<IProviderExpedition> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROVIDEREXPEDITION_LIST,
    payload: axios.get<IProviderExpedition>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProviderExpedition> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROVIDEREXPEDITION,
    payload: axios.get<IProviderExpedition>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProviderExpedition> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROVIDEREXPEDITION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProviderExpedition> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROVIDEREXPEDITION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProviderExpedition> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROVIDEREXPEDITION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
