import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAuditRecommendation, defaultValue } from 'app/shared/model/microrisque/audit-recommendation.model';

export const ACTION_TYPES = {
  FETCH_AUDITRECOMMENDATION_LIST: 'auditRecommendation/FETCH_AUDITRECOMMENDATION_LIST',
  FETCH_AUDITRECOMMENDATION: 'auditRecommendation/FETCH_AUDITRECOMMENDATION',
  CREATE_AUDITRECOMMENDATION: 'auditRecommendation/CREATE_AUDITRECOMMENDATION',
  UPDATE_AUDITRECOMMENDATION: 'auditRecommendation/UPDATE_AUDITRECOMMENDATION',
  DELETE_AUDITRECOMMENDATION: 'auditRecommendation/DELETE_AUDITRECOMMENDATION',
  SET_BLOB: 'auditRecommendation/SET_BLOB',
  RESET: 'auditRecommendation/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAuditRecommendation>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AuditRecommendationState = Readonly<typeof initialState>;

// Reducer

export default (state: AuditRecommendationState = initialState, action): AuditRecommendationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AUDITRECOMMENDATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AUDITRECOMMENDATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_AUDITRECOMMENDATION):
    case REQUEST(ACTION_TYPES.UPDATE_AUDITRECOMMENDATION):
    case REQUEST(ACTION_TYPES.DELETE_AUDITRECOMMENDATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AUDITRECOMMENDATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AUDITRECOMMENDATION):
    case FAILURE(ACTION_TYPES.CREATE_AUDITRECOMMENDATION):
    case FAILURE(ACTION_TYPES.UPDATE_AUDITRECOMMENDATION):
    case FAILURE(ACTION_TYPES.DELETE_AUDITRECOMMENDATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITRECOMMENDATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITRECOMMENDATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_AUDITRECOMMENDATION):
    case SUCCESS(ACTION_TYPES.UPDATE_AUDITRECOMMENDATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_AUDITRECOMMENDATION):
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

const apiUrl = 'services/microrisque/api/audit-recommendations';

// Actions

export const getEntities: ICrudGetAllAction<IAuditRecommendation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITRECOMMENDATION_LIST,
    payload: axios.get<IAuditRecommendation>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAuditRecommendation> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITRECOMMENDATION,
    payload: axios.get<IAuditRecommendation>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAuditRecommendation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AUDITRECOMMENDATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAuditRecommendation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AUDITRECOMMENDATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAuditRecommendation> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AUDITRECOMMENDATION,
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
