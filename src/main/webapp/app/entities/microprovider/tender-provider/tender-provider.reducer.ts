import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITenderProvider, defaultValue } from 'app/shared/model/microprovider/tender-provider.model';

export const ACTION_TYPES = {
  FETCH_TENDERPROVIDER_LIST: 'tenderProvider/FETCH_TENDERPROVIDER_LIST',
  FETCH_TENDERPROVIDER: 'tenderProvider/FETCH_TENDERPROVIDER',
  CREATE_TENDERPROVIDER: 'tenderProvider/CREATE_TENDERPROVIDER',
  UPDATE_TENDERPROVIDER: 'tenderProvider/UPDATE_TENDERPROVIDER',
  DELETE_TENDERPROVIDER: 'tenderProvider/DELETE_TENDERPROVIDER',
  RESET: 'tenderProvider/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderProvider>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderProviderState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderProviderState = initialState, action): TenderProviderState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDERPROVIDER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDERPROVIDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDERPROVIDER):
    case REQUEST(ACTION_TYPES.UPDATE_TENDERPROVIDER):
    case REQUEST(ACTION_TYPES.DELETE_TENDERPROVIDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDERPROVIDER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDERPROVIDER):
    case FAILURE(ACTION_TYPES.CREATE_TENDERPROVIDER):
    case FAILURE(ACTION_TYPES.UPDATE_TENDERPROVIDER):
    case FAILURE(ACTION_TYPES.DELETE_TENDERPROVIDER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERPROVIDER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERPROVIDER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDERPROVIDER):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDERPROVIDER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDERPROVIDER):
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

const apiUrl = 'services/microprovider/api/tender-providers';

// Actions

export const getEntities: ICrudGetAllAction<ITenderProvider> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERPROVIDER_LIST,
    payload: axios.get<ITenderProvider>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderProvider> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERPROVIDER,
    payload: axios.get<ITenderProvider>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderProvider> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDERPROVIDER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderProvider> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDERPROVIDER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderProvider> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDERPROVIDER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
