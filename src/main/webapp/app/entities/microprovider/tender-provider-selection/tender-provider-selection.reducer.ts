import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITenderProviderSelection, defaultValue } from 'app/shared/model/microprovider/tender-provider-selection.model';

export const ACTION_TYPES = {
  FETCH_TENDERPROVIDERSELECTION_LIST: 'tenderProviderSelection/FETCH_TENDERPROVIDERSELECTION_LIST',
  FETCH_TENDERPROVIDERSELECTION: 'tenderProviderSelection/FETCH_TENDERPROVIDERSELECTION',
  CREATE_TENDERPROVIDERSELECTION: 'tenderProviderSelection/CREATE_TENDERPROVIDERSELECTION',
  UPDATE_TENDERPROVIDERSELECTION: 'tenderProviderSelection/UPDATE_TENDERPROVIDERSELECTION',
  DELETE_TENDERPROVIDERSELECTION: 'tenderProviderSelection/DELETE_TENDERPROVIDERSELECTION',
  RESET: 'tenderProviderSelection/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderProviderSelection>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderProviderSelectionState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderProviderSelectionState = initialState, action): TenderProviderSelectionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDERPROVIDERSELECTION):
    case REQUEST(ACTION_TYPES.UPDATE_TENDERPROVIDERSELECTION):
    case REQUEST(ACTION_TYPES.DELETE_TENDERPROVIDERSELECTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTION):
    case FAILURE(ACTION_TYPES.CREATE_TENDERPROVIDERSELECTION):
    case FAILURE(ACTION_TYPES.UPDATE_TENDERPROVIDERSELECTION):
    case FAILURE(ACTION_TYPES.DELETE_TENDERPROVIDERSELECTION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDERPROVIDERSELECTION):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDERPROVIDERSELECTION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDERPROVIDERSELECTION):
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

const apiUrl = 'services/microprovider/api/tender-provider-selections';

// Actions

export const getEntities: ICrudGetAllAction<ITenderProviderSelection> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERPROVIDERSELECTION_LIST,
    payload: axios.get<ITenderProviderSelection>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderProviderSelection> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERPROVIDERSELECTION,
    payload: axios.get<ITenderProviderSelection>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderProviderSelection> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDERPROVIDERSELECTION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderProviderSelection> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDERPROVIDERSELECTION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderProviderSelection> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDERPROVIDERSELECTION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
