import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectTaskItem from './project-task-item';
import ProjectTaskItemDetail from './project-task-item-detail';
import ProjectTaskItemUpdate from './project-task-item-update';
import ProjectTaskItemDeleteDialog from './project-task-item-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectTaskItemUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectTaskItemUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectTaskItemDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectTaskItem} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectTaskItemDeleteDialog} />
  </>
);

export default Routes;
