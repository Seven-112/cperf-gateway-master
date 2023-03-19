import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQueryFieldResponseFile, defaultValue } from 'app/shared/model/qmanager/query-field-response-file.model';

export const ACTION_TYPES = {
  FETCH_QUERYFIELDRESPONSEFILE_LIST: 'queryFieldResponseFile/FETCH_QUERYFIELDRESPONSEFILE_LIST',
  FETCH_QUERYFIELDRESPONSEFILE: 'queryFieldResponseFile/FETCH_QUERYFIELDRESPONSEFILE',
  CREATE_QUERYFIELDRESPONSEFILE: 'queryFieldResponseFile/CREATE_QUERYFIELDRESPONSEFILE',
  UPDATE_QUERYFIELDRESPONSEFILE: 'queryFieldResponseFile/UPDATE_QUERYFIELDRESPONSEFILE',
  DELETE_QUERYFIELDRESPONSEFILE: 'queryFieldResponseFile/DELETE_QUERYFIELDRESPONSEFILE',
  RESET: 'queryFieldResponseFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryFieldResponseFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryFieldResponseFileState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryFieldResponseFileState = initialState, action): QueryFieldResponseFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYFIELDRESPONSEFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYFIELDRESPONSEFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYFIELDRESPONSEFILE):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYFIELDRESPONSEFILE):
    case REQUEST(ACTION_TYPES.DELETE_QUERYFIELDRESPONSEFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYFIELDRESPONSEFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYFIELDRESPONSEFILE):
    case FAILURE(ACTION_TYPES.CREATE_QUERYFIELDRESPONSEFILE):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYFIELDRESPONSEFILE):
    case FAILURE(ACTION_TYPES.DELETE_QUERYFIELDRESPONSEFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYFIELDRESPONSEFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYFIELDRESPONSEFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYFIELDRESPONSEFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYFIELDRESPONSEFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYFIELDRESPONSEFILE):
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

const apiUrl = 'services/qmanager/api/query-field-response-files';

// Actions

export const getEntities: ICrudGetAllAction<IQueryFieldResponseFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYFIELDRESPONSEFILE_LIST,
    payload: axios.get<IQueryFieldResponseFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryFieldResponseFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYFIELDRESPONSEFILE,
    payload: axios.get<IQueryFieldResponseFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryFieldResponseFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYFIELDRESPONSEFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryFieldResponseFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYFIELDRESPONSEFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryFieldResponseFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYFIELDRESPONSEFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
