import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectTaskUser from './project-task-user';
import ProjectTaskUserDetail from './project-task-user-detail';
import ProjectTaskUserUpdate from './project-task-user-update';
import ProjectTaskUserDeleteDialog from './project-task-user-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectTaskUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectTaskUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectTaskUserDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectTaskUser} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectTaskUserDeleteDialog} />
  </>
);

export default Routes;
