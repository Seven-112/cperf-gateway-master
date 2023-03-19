import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectTaskFile from './project-task-file';
import ProjectTaskFileDetail from './project-task-file-detail';
import ProjectTaskFileUpdate from './project-task-file-update';
import ProjectTaskFileDeleteDialog from './project-task-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectTaskFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectTaskFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectTaskFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectTaskFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectTaskFileDeleteDialog} />
  </>
);

export default Routes;
