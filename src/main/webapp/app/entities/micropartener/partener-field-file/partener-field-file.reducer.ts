import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IPartenerFieldFile, defaultValue } from 'app/shared/model/micropartener/partener-field-file.model';

export const ACTION_TYPES = {
  FETCH_PARTENERFIELDFILE_LIST: 'partenerFieldFile/FETCH_PARTENERFIELDFILE_LIST',
  FETCH_PARTENERFIELDFILE: 'partenerFieldFile/FETCH_PARTENERFIELDFILE',
  CREATE_PARTENERFIELDFILE: 'partenerFieldFile/CREATE_PARTENERFIELDFILE',
  UPDATE_PARTENERFIELDFILE: 'partenerFieldFile/UPDATE_PARTENERFIELDFILE',
  DELETE_PARTENERFIELDFILE: 'partenerFieldFile/DELETE_PARTENERFIELDFILE',
  RESET: 'partenerFieldFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPartenerFieldFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type PartenerFieldFileState = Readonly<typeof initialState>;

// Reducer

export default (state: PartenerFieldFileState = initialState, action): PartenerFieldFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PARTENERFIELDFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PARTENERFIELDFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PARTENERFIELDFILE):
    case REQUEST(ACTION_TYPES.UPDATE_PARTENERFIELDFILE):
    case REQUEST(ACTION_TYPES.DELETE_PARTENERFIELDFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PARTENERFIELDFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PARTENERFIELDFILE):
    case FAILURE(ACTION_TYPES.CREATE_PARTENERFIELDFILE):
    case FAILURE(ACTION_TYPES.UPDATE_PARTENERFIELDFILE):
    case FAILURE(ACTION_TYPES.DELETE_PARTENERFIELDFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENERFIELDFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENERFIELDFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PARTENERFIELDFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_PARTENERFIELDFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PARTENERFIELDFILE):
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

const apiUrl = 'services/micropartener/api/partener-field-files';

// Actions

export const getEntities: ICrudGetAllAction<IPartenerFieldFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENERFIELDFILE_LIST,
    payload: axios.get<IPartenerFieldFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IPartenerFieldFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENERFIELDFILE,
    payload: axios.get<IPartenerFieldFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IPartenerFieldFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PARTENERFIELDFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPartenerFieldFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PARTENERFIELDFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPartenerFieldFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PARTENERFIELDFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
