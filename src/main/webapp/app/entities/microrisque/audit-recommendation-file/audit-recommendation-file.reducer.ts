import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IAuditRecommendationFile, defaultValue } from 'app/shared/model/microrisque/audit-recommendation-file.model';

export const ACTION_TYPES = {
  FETCH_AUDITRECOMMENDATIONFILE_LIST: 'auditRecommendationFile/FETCH_AUDITRECOMMENDATIONFILE_LIST',
  FETCH_AUDITRECOMMENDATIONFILE: 'auditRecommendationFile/FETCH_AUDITRECOMMENDATIONFILE',
  CREATE_AUDITRECOMMENDATIONFILE: 'auditRecommendationFile/CREATE_AUDITRECOMMENDATIONFILE',
  UPDATE_AUDITRECOMMENDATIONFILE: 'auditRecommendationFile/UPDATE_AUDITRECOMMENDATIONFILE',
  DELETE_AUDITRECOMMENDATIONFILE: 'auditRecommendationFile/DELETE_AUDITRECOMMENDATIONFILE',
  RESET: 'auditRecommendationFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAuditRecommendationFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AuditRecommendationFileState = Readonly<typeof initialState>;

// Reducer

export default (state: AuditRecommendationFileState = initialState, action): AuditRecommendationFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AUDITRECOMMENDATIONFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AUDITRECOMMENDATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_AUDITRECOMMENDATIONFILE):
    case REQUEST(ACTION_TYPES.UPDATE_AUDITRECOMMENDATIONFILE):
    case REQUEST(ACTION_TYPES.DELETE_AUDITRECOMMENDATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AUDITRECOMMENDATIONFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AUDITRECOMMENDATIONFILE):
    case FAILURE(ACTION_TYPES.CREATE_AUDITRECOMMENDATIONFILE):
    case FAILURE(ACTION_TYPES.UPDATE_AUDITRECOMMENDATIONFILE):
    case FAILURE(ACTION_TYPES.DELETE_AUDITRECOMMENDATIONFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITRECOMMENDATIONFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITRECOMMENDATIONFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_AUDITRECOMMENDATIONFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_AUDITRECOMMENDATIONFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_AUDITRECOMMENDATIONFILE):
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

const apiUrl = 'services/microrisque/api/audit-recommendation-files';

// Actions

export const getEntities: ICrudGetAllAction<IAuditRecommendationFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITRECOMMENDATIONFILE_LIST,
    payload: axios.get<IAuditRecommendationFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAuditRecommendationFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITRECOMMENDATIONFILE,
    payload: axios.get<IAuditRecommendationFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAuditRecommendationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AUDITRECOMMENDATIONFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAuditRecommendationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AUDITRECOMMENDATIONFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAuditRecommendationFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AUDITRECOMMENDATIONFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
