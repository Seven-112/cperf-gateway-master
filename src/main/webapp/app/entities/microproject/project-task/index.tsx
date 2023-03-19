import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectTask from './project-task';
import ProjectTaskDetail from './project-task-detail';
import ProjectTaskUpdate from './project-task-update';
import ProjectTaskDeleteDialog from './project-task-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectTaskUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectTaskUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectTaskDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectTask} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectTaskDeleteDialog} />
  </>
);

export default Routes;
