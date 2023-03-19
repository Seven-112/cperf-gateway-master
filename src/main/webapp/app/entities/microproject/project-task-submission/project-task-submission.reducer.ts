import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProjectTaskSubmission, defaultValue } from 'app/shared/model/microproject/project-task-submission.model';

export const ACTION_TYPES = {
  FETCH_PROJECTTASKSUBMISSION_LIST: 'projectTaskSubmission/FETCH_PROJECTTASKSUBMISSION_LIST',
  FETCH_PROJECTTASKSUBMISSION: 'projectTaskSubmission/FETCH_PROJECTTASKSUBMISSION',
  CREATE_PROJECTTASKSUBMISSION: 'projectTaskSubmission/CREATE_PROJECTTASKSUBMISSION',
  UPDATE_PROJECTTASKSUBMISSION: 'projectTaskSubmission/UPDATE_PROJECTTASKSUBMISSION',
  DELETE_PROJECTTASKSUBMISSION: 'projectTaskSubmission/DELETE_PROJECTTASKSUBMISSION',
  SET_BLOB: 'projectTaskSubmission/SET_BLOB',
  RESET: 'projectTaskSubmission/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectTaskSubmission>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectTaskSubmissionState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectTaskSubmissionState = initialState, action): ProjectTaskSubmissionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKSUBMISSION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKSUBMISSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTTASKSUBMISSION):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTTASKSUBMISSION):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTTASKSUBMISSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKSUBMISSION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKSUBMISSION):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTTASKSUBMISSION):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTTASKSUBMISSION):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTTASKSUBMISSION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKSUBMISSION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKSUBMISSION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTTASKSUBMISSION):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTTASKSUBMISSION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTTASKSUBMISSION):
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

const apiUrl = 'services/microproject/api/project-task-submissions';

// Actions

export const getEntities: ICrudGetAllAction<IProjectTaskSubmission> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKSUBMISSION_LIST,
    payload: axios.get<IProjectTaskSubmission>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectTaskSubmission> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKSUBMISSION,
    payload: axios.get<IProjectTaskSubmission>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectTaskSubmission> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTTASKSUBMISSION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectTaskSubmission> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTTASKSUBMISSION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectTaskSubmission> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTTASKSUBMISSION,
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
