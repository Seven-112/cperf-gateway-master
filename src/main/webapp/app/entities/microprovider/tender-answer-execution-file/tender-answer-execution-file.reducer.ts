import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITenderAnswerExecutionFile, defaultValue } from 'app/shared/model/microprovider/tender-answer-execution-file.model';

export const ACTION_TYPES = {
  FETCH_TENDERANSWEREXECUTIONFILE_LIST: 'tenderAnswerExecutionFile/FETCH_TENDERANSWEREXECUTIONFILE_LIST',
  FETCH_TENDERANSWEREXECUTIONFILE: 'tenderAnswerExecutionFile/FETCH_TENDERANSWEREXECUTIONFILE',
  CREATE_TENDERANSWEREXECUTIONFILE: 'tenderAnswerExecutionFile/CREATE_TENDERANSWEREXECUTIONFILE',
  UPDATE_TENDERANSWEREXECUTIONFILE: 'tenderAnswerExecutionFile/UPDATE_TENDERANSWEREXECUTIONFILE',
  DELETE_TENDERANSWEREXECUTIONFILE: 'tenderAnswerExecutionFile/DELETE_TENDERANSWEREXECUTIONFILE',
  RESET: 'tenderAnswerExecutionFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderAnswerExecutionFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderAnswerExecutionFileState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderAnswerExecutionFileState = initialState, action): TenderAnswerExecutionFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWEREXECUTIONFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWEREXECUTIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDERANSWEREXECUTIONFILE):
    case REQUEST(ACTION_TYPES.UPDATE_TENDERANSWEREXECUTIONFILE):
    case REQUEST(ACTION_TYPES.DELETE_TENDERANSWEREXECUTIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWEREXECUTIONFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWEREXECUTIONFILE):
    case FAILURE(ACTION_TYPES.CREATE_TENDERANSWEREXECUTIONFILE):
    case FAILURE(ACTION_TYPES.UPDATE_TENDERANSWEREXECUTIONFILE):
    case FAILURE(ACTION_TYPES.DELETE_TENDERANSWEREXECUTIONFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWEREXECUTIONFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWEREXECUTIONFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDERANSWEREXECUTIONFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDERANSWEREXECUTIONFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDERANSWEREXECUTIONFILE):
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

const apiUrl = 'services/microprovider/api/tender-answer-execution-files';

// Actions

export const getEntities: ICrudGetAllAction<ITenderAnswerExecutionFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWEREXECUTIONFILE_LIST,
    payload: axios.get<ITenderAnswerExecutionFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderAnswerExecutionFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWEREXECUTIONFILE,
    payload: axios.get<ITenderAnswerExecutionFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderAnswerExecutionFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDERANSWEREXECUTIONFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderAnswerExecutionFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDERANSWEREXECUTIONFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderAnswerExecutionFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDERANSWEREXECUTIONFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
