import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TaskStatusTraking from './task-status-traking';
import TaskStatusTrakingDetail from './task-status-traking-detail';
import TaskStatusTrakingUpdate from './task-status-traking-update';
import TaskStatusTrakingDeleteDialog from './task-status-traking-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TaskStatusTrakingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TaskStatusTrakingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TaskStatusTrakingDetail} />
      <ErrorBoundaryRoute path={match.url} component={TaskStatusTraking} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TaskStatusTrakingDeleteDialog} />
  </>
);

export default Routes;
