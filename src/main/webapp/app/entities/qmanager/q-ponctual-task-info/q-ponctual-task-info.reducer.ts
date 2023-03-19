import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQPonctualTaskInfo, defaultValue } from 'app/shared/model/qmanager/q-ponctual-task-info.model';

export const ACTION_TYPES = {
  FETCH_QPONCTUALTASKINFO_LIST: 'qPonctualTaskInfo/FETCH_QPONCTUALTASKINFO_LIST',
  FETCH_QPONCTUALTASKINFO: 'qPonctualTaskInfo/FETCH_QPONCTUALTASKINFO',
  CREATE_QPONCTUALTASKINFO: 'qPonctualTaskInfo/CREATE_QPONCTUALTASKINFO',
  UPDATE_QPONCTUALTASKINFO: 'qPonctualTaskInfo/UPDATE_QPONCTUALTASKINFO',
  DELETE_QPONCTUALTASKINFO: 'qPonctualTaskInfo/DELETE_QPONCTUALTASKINFO',
  RESET: 'qPonctualTaskInfo/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQPonctualTaskInfo>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QPonctualTaskInfoState = Readonly<typeof initialState>;

// Reducer

export default (state: QPonctualTaskInfoState = initialState, action): QPonctualTaskInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QPONCTUALTASKINFO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QPONCTUALTASKINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QPONCTUALTASKINFO):
    case REQUEST(ACTION_TYPES.UPDATE_QPONCTUALTASKINFO):
    case REQUEST(ACTION_TYPES.DELETE_QPONCTUALTASKINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QPONCTUALTASKINFO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QPONCTUALTASKINFO):
    case FAILURE(ACTION_TYPES.CREATE_QPONCTUALTASKINFO):
    case FAILURE(ACTION_TYPES.UPDATE_QPONCTUALTASKINFO):
    case FAILURE(ACTION_TYPES.DELETE_QPONCTUALTASKINFO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QPONCTUALTASKINFO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QPONCTUALTASKINFO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QPONCTUALTASKINFO):
    case SUCCESS(ACTION_TYPES.UPDATE_QPONCTUALTASKINFO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QPONCTUALTASKINFO):
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

const apiUrl = 'services/qmanager/api/q-ponctual-task-infos';

// Actions

export const getEntities: ICrudGetAllAction<IQPonctualTaskInfo> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QPONCTUALTASKINFO_LIST,
    payload: axios.get<IQPonctualTaskInfo>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQPonctualTaskInfo> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QPONCTUALTASKINFO,
    payload: axios.get<IQPonctualTaskInfo>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQPonctualTaskInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QPONCTUALTASKINFO,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQPonctualTaskInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QPONCTUALTASKINFO,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQPonctualTaskInfo> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QPONCTUALTASKINFO,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
