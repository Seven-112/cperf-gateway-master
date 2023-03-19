import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IExecutionValidationFile, defaultValue } from 'app/shared/model/microprovider/execution-validation-file.model';

export const ACTION_TYPES = {
  FETCH_EXECUTIONVALIDATIONFILE_LIST: 'executionValidationFile/FETCH_EXECUTIONVALIDATIONFILE_LIST',
  FETCH_EXECUTIONVALIDATIONFILE: 'executionValidationFile/FETCH_EXECUTIONVALIDATIONFILE',
  CREATE_EXECUTIONVALIDATIONFILE: 'executionValidationFile/CREATE_EXECUTIONVALIDATIONFILE',
  UPDATE_EXECUTIONVALIDATIONFILE: 'executionValidationFile/UPDATE_EXECUTIONVALIDATIONFILE',
  DELETE_EXECUTIONVALIDATIONFILE: 'executionValidationFile/DELETE_EXECUTIONVALIDATIONFILE',
  RESET: 'executionValidationFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IExecutionValidationFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ExecutionValidationFileState = Readonly<typeof initialState>;

// Reducer

export default (state: ExecutionValidationFileState = initialState, action): ExecutionValidationFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_EXECUTIONVALIDATIONFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EXECUTIONVALIDATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_EXECUTIONVALIDATIONFILE):
    case REQUEST(ACTION_TYPES.UPDATE_EXECUTIONVALIDATIONFILE):
    case REQUEST(ACTION_TYPES.DELETE_EXECUTIONVALIDATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EXECUTIONVALIDATIONFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EXECUTIONVALIDATIONFILE):
    case FAILURE(ACTION_TYPES.CREATE_EXECUTIONVALIDATIONFILE):
    case FAILURE(ACTION_TYPES.UPDATE_EXECUTIONVALIDATIONFILE):
    case FAILURE(ACTION_TYPES.DELETE_EXECUTIONVALIDATIONFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EXECUTIONVALIDATIONFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_EXECUTIONVALIDATIONFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EXECUTIONVALIDATIONFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_EXECUTIONVALIDATIONFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_EXECUTIONVALIDATIONFILE):
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

const apiUrl = 'services/microprovider/api/execution-validation-files';

// Actions

export const getEntities: ICrudGetAllAction<IExecutionValidationFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_EXECUTIONVALIDATIONFILE_LIST,
    payload: axios.get<IExecutionValidationFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IExecutionValidationFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EXECUTIONVALIDATIONFILE,
    payload: axios.get<IExecutionValidationFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IExecutionValidationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EXECUTIONVALIDATIONFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IExecutionValidationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EXECUTIONVALIDATIONFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IExecutionValidationFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EXECUTIONVALIDATIONFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
