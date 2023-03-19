import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IAuditStatusTrakingFile, defaultValue } from 'app/shared/model/microrisque/audit-status-traking-file.model';

export const ACTION_TYPES = {
  FETCH_AUDITSTATUSTRAKINGFILE_LIST: 'auditStatusTrakingFile/FETCH_AUDITSTATUSTRAKINGFILE_LIST',
  FETCH_AUDITSTATUSTRAKINGFILE: 'auditStatusTrakingFile/FETCH_AUDITSTATUSTRAKINGFILE',
  CREATE_AUDITSTATUSTRAKINGFILE: 'auditStatusTrakingFile/CREATE_AUDITSTATUSTRAKINGFILE',
  UPDATE_AUDITSTATUSTRAKINGFILE: 'auditStatusTrakingFile/UPDATE_AUDITSTATUSTRAKINGFILE',
  DELETE_AUDITSTATUSTRAKINGFILE: 'auditStatusTrakingFile/DELETE_AUDITSTATUSTRAKINGFILE',
  RESET: 'auditStatusTrakingFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAuditStatusTrakingFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AuditStatusTrakingFileState = Readonly<typeof initialState>;

// Reducer

export default (state: AuditStatusTrakingFileState = initialState, action): AuditStatusTrakingFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AUDITSTATUSTRAKINGFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AUDITSTATUSTRAKINGFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_AUDITSTATUSTRAKINGFILE):
    case REQUEST(ACTION_TYPES.UPDATE_AUDITSTATUSTRAKINGFILE):
    case REQUEST(ACTION_TYPES.DELETE_AUDITSTATUSTRAKINGFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AUDITSTATUSTRAKINGFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AUDITSTATUSTRAKINGFILE):
    case FAILURE(ACTION_TYPES.CREATE_AUDITSTATUSTRAKINGFILE):
    case FAILURE(ACTION_TYPES.UPDATE_AUDITSTATUSTRAKINGFILE):
    case FAILURE(ACTION_TYPES.DELETE_AUDITSTATUSTRAKINGFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITSTATUSTRAKINGFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITSTATUSTRAKINGFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_AUDITSTATUSTRAKINGFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_AUDITSTATUSTRAKINGFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_AUDITSTATUSTRAKINGFILE):
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

const apiUrl = 'services/microrisque/api/audit-status-traking-files';

// Actions

export const getEntities: ICrudGetAllAction<IAuditStatusTrakingFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITSTATUSTRAKINGFILE_LIST,
    payload: axios.get<IAuditStatusTrakingFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAuditStatusTrakingFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITSTATUSTRAKINGFILE,
    payload: axios.get<IAuditStatusTrakingFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAuditStatusTrakingFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AUDITSTATUSTRAKINGFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAuditStatusTrakingFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AUDITSTATUSTRAKINGFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAuditStatusTrakingFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AUDITSTATUSTRAKINGFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
