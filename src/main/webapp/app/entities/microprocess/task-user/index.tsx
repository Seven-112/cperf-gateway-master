import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TaskUser from './task-user';
import TaskUserDetail from './task-user-detail';
import TaskUserUpdate from './task-user-update';
import TaskUserDeleteDialog from './task-user-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TaskUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TaskUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TaskUserDetail} />
      <ErrorBoundaryRoute path={match.url} component={TaskUser} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TaskUserDeleteDialog} />
  </>
);

export default Routes;
