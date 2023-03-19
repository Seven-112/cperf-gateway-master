import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Task from './task';
import TaskDetail from './task-detail'; 
import TaskUpdate from './custom/task-update';
import TaskDeleteDialog from './task-delete-dialog';
import LoggedTask from './custom/user-task';
import EmployeeTask from './custom/employee-task';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import UserChecklistTask from './custom/user-checklist-task';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/check-list`} component={UserChecklistTask} />
      <PrivateRoute exact path={`${match.url}/by-employee`} component={EmployeeTask} 
        hasAnyPrivileges={{ entities: ['Process','Task'],
             actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE, PrivilegeAction.LISTE] }}/>
      <PrivateRoute exact path={`${match.url}/:processId/new`} component={TaskUpdate}
          hasAnyPrivileges={{ entities: ['Process','Task'], actions: [PrivilegeAction.CREATE] }} />
      <PrivateRoute exact path={`${match.url}/:processId/:id/edit`} component={TaskUpdate}
           hasAnyPrivileges={{ entities: ['Process','Task'],actions: [PrivilegeAction.UPDATE] }} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TaskDetail} />
      <ErrorBoundaryRoute path={match.url} component={LoggedTask} />
    </Switch>
    <PrivateRoute exact path={`${match.url}/:id/delete`} component={TaskDeleteDialog}
            hasAnyPrivileges={{ entities: ['Process','Task'], actions: [PrivilegeAction.DELETE] }} />
  </>
);

export default Routes;
