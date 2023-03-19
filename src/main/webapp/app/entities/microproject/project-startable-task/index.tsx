import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectStartableTask from './project-startable-task';
import ProjectStartableTaskDetail from './project-startable-task-detail';
import ProjectStartableTaskUpdate from './project-startable-task-update';
import ProjectStartableTaskDeleteDialog from './project-startable-task-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectStartableTaskUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectStartableTaskUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectStartableTaskDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectStartableTask} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectStartableTaskDeleteDialog} />
  </>
);

export default Routes;
