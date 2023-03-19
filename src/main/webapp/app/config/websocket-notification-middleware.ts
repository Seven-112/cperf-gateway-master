import SockJS from 'sockjs-client';

import Stomp from 'webstomp-client';
import { Storage } from 'react-jhipster';
import myStore from 'app/config/full-accessible-store';

import { ACTION_TYPES as AUTH_ACTIONS } from 'app/shared/reducers/authentication';
import {
  ACTION_TYPES as NOTIFICATION_ACTION,
  pushNotification,
  getUserNotifications,
  reset as resetNotifications,
} from 'app/entities/notification/notification.reducer';
import { SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { INotification } from 'app/shared/model/notification.model';

let stompClient = null;

let subscriber = null;
let connection: Promise<any>;
let connectedPromise: any = null;
let alreadyConnectedOnce = false;

const createConnection = (): Promise<any> => new Promise((resolve, reject) => (connectedPromise = resolve));

const sendNotification = (notif: INotification) => {
  connection.then(() => {
    stompClient.send('/topic/notify', JSON.stringify(notif), {});
  });
};

const subscribe = () => {
  connection.then(() => {
    subscriber = stompClient.subscribe('/user/topic/notifications', data => {
      const notif = JSON.parse(data.body);
      if (notif && notif.destUserName) delete notif.destUserName; // this property is not defined in notification model interface
      myStore.dispatch(pushNotification(notif));
    });
  });
};

const connect = () => {
  if (connectedPromise !== null || alreadyConnectedOnce) {
    // the connection is already being established
    return;
  }
  connection = createConnection();

  // building absolute path so that websocket doesn't fail when deploying with a context path
  const loc = window.location;
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

  const headers = {};
  let url = '//' + loc.host + baseHref + '/websocket/notification';
  const authToken = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  if (authToken) {
    url += '?access_token=' + authToken;
  }
  const socket = new SockJS(url);
  stompClient = Stomp.over(socket);

  stompClient.connect(headers, () => {
    connectedPromise('success');
    connectedPromise = null;
    subscribe();
    alreadyConnectedOnce = true;
  });
};

const disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
    stompClient = null;
  }
  alreadyConnectedOnce = false;
};

const unsubscribe = () => {
  if (subscriber !== null) {
    subscriber.unsubscribe();
  }
};

export default store => next => action => {
  if (action.type === SUCCESS(AUTH_ACTIONS.GET_SESSION)) {
    connect();
  } else if (action.type === SUCCESS(NOTIFICATION_ACTION.CREATE_NOTIFICATION)) {
    const notification: INotification = action.payload.data;
    sendNotification(notification);
  } else if (action.type === FAILURE(AUTH_ACTIONS.GET_SESSION)) {
    unsubscribe();
    disconnect();
  } else if (action.type === AUTH_ACTIONS.LOGOUT) {
    store.dispatch(resetNotifications());
  }
  return next(action);
};
