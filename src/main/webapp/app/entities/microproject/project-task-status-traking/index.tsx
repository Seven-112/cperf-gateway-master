import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectTaskStatusTraking from './project-task-status-traking';
import ProjectTaskStatusTrakingDetail from './project-task-status-traking-detail';
import ProjectTaskStatusTrakingUpdate from './project-task-status-traking-update';
import ProjectTaskStatusTrakingDeleteDialog from './project-task-status-traking-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectTaskStatusTrakingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectTaskStatusTrakingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectTaskStatusTrakingDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectTaskStatusTraking} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectTaskStatusTrakingDeleteDialog} />
  </>
);

export default Routes;
