import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { INotification, defaultValue } from 'app/shared/model/notification.model';

export const ACTION_TYPES = {
  FETCH_NOTIFICATION_LIST: 'notification/FETCH_NOTIFICATION_LIST',
  FETCH_NOTIFICATION: 'notification/FETCH_NOTIFICATION',
  CREATE_NOTIFICATION: 'notification/CREATE_NOTIFICATION',
  UPDATE_NOTIFICATION: 'notification/UPDATE_NOTIFICATION',
  DELETE_NOTIFICATION: 'notification/DELETE_NOTIFICATION',
  RESET: 'notification/RESET',
  PUSH_NOTIFICATION: 'notification/PUSH_NOTIFICATION',
  FETCH_UER_NOTIFICATIONS: 'notification/FETCH_UER_NOTIFICATIONS',
  SEEN_ALL_USER_NOTIFICATIONS: 'notification/SEEN_ALL_USER_NOTIFICATIONS',
  SEEN_ALL_USER_NOTIFICATIONS_BY_TAG: 'notification/SEEN_ALL_USER_NOTIFICATIONS_BY_TAG',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<INotification>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type NotificationState = Readonly<typeof initialState>;

// Reducer

export default (state: NotificationState = initialState, action): NotificationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_NOTIFICATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_NOTIFICATION):
    case REQUEST(ACTION_TYPES.SEEN_ALL_USER_NOTIFICATIONS):
    case REQUEST(ACTION_TYPES.SEEN_ALL_USER_NOTIFICATIONS_BY_TAG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_NOTIFICATION):
    case REQUEST(ACTION_TYPES.UPDATE_NOTIFICATION):
    case REQUEST(ACTION_TYPES.DELETE_NOTIFICATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_NOTIFICATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_NOTIFICATION):
    case FAILURE(ACTION_TYPES.CREATE_NOTIFICATION):
    case FAILURE(ACTION_TYPES.UPDATE_NOTIFICATION):
    case FAILURE(ACTION_TYPES.DELETE_NOTIFICATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_NOTIFICATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_NOTIFICATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_NOTIFICATION):
    case SUCCESS(ACTION_TYPES.UPDATE_NOTIFICATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
        entities: state.entities.map(note => (action.payload.data && note.id === action.payload.data.id ? action.payload.data : note)),
      };
    case SUCCESS(ACTION_TYPES.DELETE_NOTIFICATION):
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
    case SUCCESS(ACTION_TYPES.PUSH_NOTIFICATION):
    case ACTION_TYPES.PUSH_NOTIFICATION:
      return {
        ...state,
        entity: action.payload,
        entities: [action.payload, ...state.entities],
      };
    case SUCCESS(ACTION_TYPES.FETCH_UER_NOTIFICATIONS):
      return {
        ...state,
        entities: [...action.payload.data],
        totalItems: action.payload.data.length,
      };
    case SUCCESS(ACTION_TYPES.SEEN_ALL_USER_NOTIFICATIONS):
      return {
        ...state,
        entities: [...state.entities].map(item => {
          const note: INotification = { ...item, seen: true };
          return note;
        }),
        updating: false,
        loading: false,
      };
    case SUCCESS(ACTION_TYPES.SEEN_ALL_USER_NOTIFICATIONS_BY_TAG):
      return {
        ...state,
        entities: [...state.entities].map(item => {
          const seen = [...action.payload.data].some(entity => entity.id === item.id);
          const note: INotification = { ...item, seen };
          return note;
        }),
        updating: false,
        loading: false,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/notifications';

// Actions

export const getEntities: ICrudGetAllAction<INotification> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_NOTIFICATION_LIST,
    payload: axios.get<INotification>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<INotification> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_NOTIFICATION,
    payload: axios.get<INotification>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<INotification> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_NOTIFICATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<INotification> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_NOTIFICATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<INotification> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_NOTIFICATION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const pushNotification = (notification: INotification) => {
  const result = {
    type: ACTION_TYPES.PUSH_NOTIFICATION,
    payload: notification,
  };
  return result;
};

export const getUserNotifications: any = () => async dispatch => {
  const requestUrl = `${apiUrl}/getAll/`;
  const result = await dispatch({
    type: ACTION_TYPES.FETCH_UER_NOTIFICATIONS,
    payload: axios.get<INotification>(`${requestUrl}`),
  });
  return result;
};

export const seenAllUserNotifications: ICrudPutAction<any> = () => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.SEEN_ALL_USER_NOTIFICATIONS,
    payload: axios.get(`${apiUrl}/seenUserNotifications`),
  });
  return result;
};

export const seenUserNotificationByTags: ICrudPutAction<any> = (tags: string[]) => async dispatch => {
  const requestUri = `${apiUrl}/changeSeenByTargetAndTags/?tags=${[...tags].join(',')}&seen=${true}`;
  const result = await dispatch({
    type: ACTION_TYPES.SEEN_ALL_USER_NOTIFICATIONS_BY_TAG,
    payload: axios.get<INotification>(requestUri),
  });
  return result;
};
