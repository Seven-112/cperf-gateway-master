import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IItemCheckJustificationFile, defaultValue } from 'app/shared/model/microprocess/item-check-justification-file.model';

export const ACTION_TYPES = {
  FETCH_ITEMCHECKJUSTIFICATIONFILE_LIST: 'itemCheckJustificationFile/FETCH_ITEMCHECKJUSTIFICATIONFILE_LIST',
  FETCH_ITEMCHECKJUSTIFICATIONFILE: 'itemCheckJustificationFile/FETCH_ITEMCHECKJUSTIFICATIONFILE',
  CREATE_ITEMCHECKJUSTIFICATIONFILE: 'itemCheckJustificationFile/CREATE_ITEMCHECKJUSTIFICATIONFILE',
  UPDATE_ITEMCHECKJUSTIFICATIONFILE: 'itemCheckJustificationFile/UPDATE_ITEMCHECKJUSTIFICATIONFILE',
  DELETE_ITEMCHECKJUSTIFICATIONFILE: 'itemCheckJustificationFile/DELETE_ITEMCHECKJUSTIFICATIONFILE',
  RESET: 'itemCheckJustificationFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IItemCheckJustificationFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ItemCheckJustificationFileState = Readonly<typeof initialState>;

// Reducer

export default (state: ItemCheckJustificationFileState = initialState, action): ItemCheckJustificationFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATIONFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_ITEMCHECKJUSTIFICATIONFILE):
    case REQUEST(ACTION_TYPES.UPDATE_ITEMCHECKJUSTIFICATIONFILE):
    case REQUEST(ACTION_TYPES.DELETE_ITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATIONFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATIONFILE):
    case FAILURE(ACTION_TYPES.CREATE_ITEMCHECKJUSTIFICATIONFILE):
    case FAILURE(ACTION_TYPES.UPDATE_ITEMCHECKJUSTIFICATIONFILE):
    case FAILURE(ACTION_TYPES.DELETE_ITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATIONFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_ITEMCHECKJUSTIFICATIONFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_ITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_ITEMCHECKJUSTIFICATIONFILE):
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

const apiUrl = 'services/microprocess/api/item-check-justification-files';

// Actions

export const getEntities: ICrudGetAllAction<IItemCheckJustificationFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATIONFILE_LIST,
    payload: axios.get<IItemCheckJustificationFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IItemCheckJustificationFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATIONFILE,
    payload: axios.get<IItemCheckJustificationFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IItemCheckJustificationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ITEMCHECKJUSTIFICATIONFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IItemCheckJustificationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ITEMCHECKJUSTIFICATIONFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IItemCheckJustificationFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ITEMCHECKJUSTIFICATIONFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
