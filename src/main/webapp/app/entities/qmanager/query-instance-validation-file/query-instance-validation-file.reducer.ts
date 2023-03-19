import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQueryInstanceValidationFile, defaultValue } from 'app/shared/model/qmanager/query-instance-validation-file.model';

export const ACTION_TYPES = {
  FETCH_QUERYINSTANCEVALIDATIONFILE_LIST: 'queryInstanceValidationFile/FETCH_QUERYINSTANCEVALIDATIONFILE_LIST',
  FETCH_QUERYINSTANCEVALIDATIONFILE: 'queryInstanceValidationFile/FETCH_QUERYINSTANCEVALIDATIONFILE',
  CREATE_QUERYINSTANCEVALIDATIONFILE: 'queryInstanceValidationFile/CREATE_QUERYINSTANCEVALIDATIONFILE',
  UPDATE_QUERYINSTANCEVALIDATIONFILE: 'queryInstanceValidationFile/UPDATE_QUERYINSTANCEVALIDATIONFILE',
  DELETE_QUERYINSTANCEVALIDATIONFILE: 'queryInstanceValidationFile/DELETE_QUERYINSTANCEVALIDATIONFILE',
  RESET: 'queryInstanceValidationFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryInstanceValidationFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryInstanceValidationFileState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryInstanceValidationFileState = initialState, action): QueryInstanceValidationFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATIONFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYINSTANCEVALIDATIONFILE):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYINSTANCEVALIDATIONFILE):
    case REQUEST(ACTION_TYPES.DELETE_QUERYINSTANCEVALIDATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATIONFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATIONFILE):
    case FAILURE(ACTION_TYPES.CREATE_QUERYINSTANCEVALIDATIONFILE):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYINSTANCEVALIDATIONFILE):
    case FAILURE(ACTION_TYPES.DELETE_QUERYINSTANCEVALIDATIONFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATIONFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATIONFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYINSTANCEVALIDATIONFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYINSTANCEVALIDATIONFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYINSTANCEVALIDATIONFILE):
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

const apiUrl = 'services/qmanager/api/query-instance-validation-files';

// Actions

export const getEntities: ICrudGetAllAction<IQueryInstanceValidationFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATIONFILE_LIST,
    payload: axios.get<IQueryInstanceValidationFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryInstanceValidationFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATIONFILE,
    payload: axios.get<IQueryInstanceValidationFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryInstanceValidationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYINSTANCEVALIDATIONFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryInstanceValidationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYINSTANCEVALIDATIONFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryInstanceValidationFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYINSTANCEVALIDATIONFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
