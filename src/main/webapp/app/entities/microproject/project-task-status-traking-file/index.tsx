import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectTaskStatusTrakingFile from './project-task-status-traking-file';
import ProjectTaskStatusTrakingFileDetail from './project-task-status-traking-file-detail';
import ProjectTaskStatusTrakingFileUpdate from './project-task-status-traking-file-update';
import ProjectTaskStatusTrakingFileDeleteDialog from './project-task-status-traking-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectTaskStatusTrakingFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectTaskStatusTrakingFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectTaskStatusTrakingFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectTaskStatusTrakingFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectTaskStatusTrakingFileDeleteDialog} />
  </>
);

export default Routes;
