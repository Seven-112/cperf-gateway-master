import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TaskStatusTrakingFile from './task-status-traking-file';
import TaskStatusTrakingFileDetail from './task-status-traking-file-detail';
import TaskStatusTrakingFileUpdate from './task-status-traking-file-update';
import TaskStatusTrakingFileDeleteDialog from './task-status-traking-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TaskStatusTrakingFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TaskStatusTrakingFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TaskStatusTrakingFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={TaskStatusTrakingFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TaskStatusTrakingFileDeleteDialog} />
  </>
);

export default Routes;
