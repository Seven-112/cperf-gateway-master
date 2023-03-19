import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAuditStatusTraking, defaultValue } from 'app/shared/model/microrisque/audit-status-traking.model';

export const ACTION_TYPES = {
  FETCH_AUDITSTATUSTRAKING_LIST: 'auditStatusTraking/FETCH_AUDITSTATUSTRAKING_LIST',
  FETCH_AUDITSTATUSTRAKING: 'auditStatusTraking/FETCH_AUDITSTATUSTRAKING',
  CREATE_AUDITSTATUSTRAKING: 'auditStatusTraking/CREATE_AUDITSTATUSTRAKING',
  UPDATE_AUDITSTATUSTRAKING: 'auditStatusTraking/UPDATE_AUDITSTATUSTRAKING',
  DELETE_AUDITSTATUSTRAKING: 'auditStatusTraking/DELETE_AUDITSTATUSTRAKING',
  SET_BLOB: 'auditStatusTraking/SET_BLOB',
  RESET: 'auditStatusTraking/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAuditStatusTraking>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AuditStatusTrakingState = Readonly<typeof initialState>;

// Reducer

export default (state: AuditStatusTrakingState = initialState, action): AuditStatusTrakingState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AUDITSTATUSTRAKING_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AUDITSTATUSTRAKING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_AUDITSTATUSTRAKING):
    case REQUEST(ACTION_TYPES.UPDATE_AUDITSTATUSTRAKING):
    case REQUEST(ACTION_TYPES.DELETE_AUDITSTATUSTRAKING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AUDITSTATUSTRAKING_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AUDITSTATUSTRAKING):
    case FAILURE(ACTION_TYPES.CREATE_AUDITSTATUSTRAKING):
    case FAILURE(ACTION_TYPES.UPDATE_AUDITSTATUSTRAKING):
    case FAILURE(ACTION_TYPES.DELETE_AUDITSTATUSTRAKING):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITSTATUSTRAKING_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITSTATUSTRAKING):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_AUDITSTATUSTRAKING):
    case SUCCESS(ACTION_TYPES.UPDATE_AUDITSTATUSTRAKING):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_AUDITSTATUSTRAKING):
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

const apiUrl = 'services/microrisque/api/audit-status-trakings';

// Actions

export const getEntities: ICrudGetAllAction<IAuditStatusTraking> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITSTATUSTRAKING_LIST,
    payload: axios.get<IAuditStatusTraking>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAuditStatusTraking> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AUDITSTATUSTRAKING,
    payload: axios.get<IAuditStatusTraking>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAuditStatusTraking> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AUDITSTATUSTRAKING,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAuditStatusTraking> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AUDITSTATUSTRAKING,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAuditStatusTraking> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AUDITSTATUSTRAKING,
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
