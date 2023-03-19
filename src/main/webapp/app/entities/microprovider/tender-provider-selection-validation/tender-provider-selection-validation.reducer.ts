import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import {
  ITenderProviderSelectionValidation,
  defaultValue,
} from 'app/shared/model/microprovider/tender-provider-selection-validation.model';

export const ACTION_TYPES = {
  FETCH_TENDERPROVIDERSELECTIONVALIDATION_LIST: 'tenderProviderSelectionValidation/FETCH_TENDERPROVIDERSELECTIONVALIDATION_LIST',
  FETCH_TENDERPROVIDERSELECTIONVALIDATION: 'tenderProviderSelectionValidation/FETCH_TENDERPROVIDERSELECTIONVALIDATION',
  CREATE_TENDERPROVIDERSELECTIONVALIDATION: 'tenderProviderSelectionValidation/CREATE_TENDERPROVIDERSELECTIONVALIDATION',
  UPDATE_TENDERPROVIDERSELECTIONVALIDATION: 'tenderProviderSelectionValidation/UPDATE_TENDERPROVIDERSELECTIONVALIDATION',
  DELETE_TENDERPROVIDERSELECTIONVALIDATION: 'tenderProviderSelectionValidation/DELETE_TENDERPROVIDERSELECTIONVALIDATION',
  SET_BLOB: 'tenderProviderSelectionValidation/SET_BLOB',
  RESET: 'tenderProviderSelectionValidation/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderProviderSelectionValidation>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderProviderSelectionValidationState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderProviderSelectionValidationState = initialState, action): TenderProviderSelectionValidationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTIONVALIDATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTIONVALIDATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDERPROVIDERSELECTIONVALIDATION):
    case REQUEST(ACTION_TYPES.UPDATE_TENDERPROVIDERSELECTIONVALIDATION):
    case REQUEST(ACTION_TYPES.DELETE_TENDERPROVIDERSELECTIONVALIDATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTIONVALIDATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTIONVALIDATION):
    case FAILURE(ACTION_TYPES.CREATE_TENDERPROVIDERSELECTIONVALIDATION):
    case FAILURE(ACTION_TYPES.UPDATE_TENDERPROVIDERSELECTIONVALIDATION):
    case FAILURE(ACTION_TYPES.DELETE_TENDERPROVIDERSELECTIONVALIDATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTIONVALIDATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERPROVIDERSELECTIONVALIDATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDERPROVIDERSELECTIONVALIDATION):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDERPROVIDERSELECTIONVALIDATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDERPROVIDERSELECTIONVALIDATION):
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

const apiUrl = 'services/microprovider/api/tender-provider-selection-validations';

// Actions

export const getEntities: ICrudGetAllAction<ITenderProviderSelectionValidation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERPROVIDERSELECTIONVALIDATION_LIST,
    payload: axios.get<ITenderProviderSelectionValidation>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderProviderSelectionValidation> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERPROVIDERSELECTIONVALIDATION,
    payload: axios.get<ITenderProviderSelectionValidation>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderProviderSelectionValidation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDERPROVIDERSELECTIONVALIDATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderProviderSelectionValidation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDERPROVIDERSELECTIONVALIDATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderProviderSelectionValidation> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDERPROVIDERSELECTIONVALIDATION,
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
