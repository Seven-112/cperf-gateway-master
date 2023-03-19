import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITenderFile, defaultValue } from 'app/shared/model/microprovider/tender-file.model';

export const ACTION_TYPES = {
  FETCH_TENDERFILE_LIST: 'tenderFile/FETCH_TENDERFILE_LIST',
  FETCH_TENDERFILE: 'tenderFile/FETCH_TENDERFILE',
  CREATE_TENDERFILE: 'tenderFile/CREATE_TENDERFILE',
  UPDATE_TENDERFILE: 'tenderFile/UPDATE_TENDERFILE',
  DELETE_TENDERFILE: 'tenderFile/DELETE_TENDERFILE',
  RESET: 'tenderFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderFileState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderFileState = initialState, action): TenderFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDERFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDERFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDERFILE):
    case REQUEST(ACTION_TYPES.UPDATE_TENDERFILE):
    case REQUEST(ACTION_TYPES.DELETE_TENDERFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDERFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDERFILE):
    case FAILURE(ACTION_TYPES.CREATE_TENDERFILE):
    case FAILURE(ACTION_TYPES.UPDATE_TENDERFILE):
    case FAILURE(ACTION_TYPES.DELETE_TENDERFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDERFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDERFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDERFILE):
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

const apiUrl = 'services/microprovider/api/tender-files';

// Actions

export const getEntities: ICrudGetAllAction<ITenderFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERFILE_LIST,
    payload: axios.get<ITenderFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERFILE,
    payload: axios.get<ITenderFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDERFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDERFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDERFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
