import axios from 'axios';
import { NotifType } from '../model/enumerations/notif-type.model';
import { ITask } from '../model/microprocess/task.model';
import { INotification } from '../model/notification.model';
import { API_URIS, getTaskUsers } from './helpers';
import store from 'app/config/full-accessible-store';
import { ACTION_TYPES } from 'app/entities/notification/notification.reducer';
import { cleanEntity } from './entity-utils';
import { AUTHORITIES } from 'app/config/constants';

export const notifyTaskStatusChanged = (task: ITask) => {
  if (task) {
    const storeState = store.getState();
    const account = storeState.authentication.account || { id: 0 };
    getTaskUsers(task)
      .then(tu => {
        tu.forEach(user => {
          const link = user.authorities && user.authorities.includes(AUTHORITIES.ADMIN) ? '/task/by-employee' : '/task';
          if (account.id) {
            const notification: INotification = {
              seen: false,
              title: 'La tâche ' + task.name + ' a changé de status',
              type: NotifType.INFO,
              senderId: account.id,
              targetId: user.id,
              link,
            };
            store.dispatch({
              type: ACTION_TYPES.CREATE_NOTIFICATION,
              payload: axios.post(API_URIS.notificationApiUri, cleanEntity(notification)),
            });
          }
        });
      })
      .catch(e => {
        /* eslint-disable no-console */
        console.log(e);
      });
  }
};
