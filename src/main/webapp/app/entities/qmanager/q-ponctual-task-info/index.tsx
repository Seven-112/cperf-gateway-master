import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QPonctualTaskInfo from './q-ponctual-task-info';
import QPonctualTaskInfoDetail from './q-ponctual-task-info-detail';
import QPonctualTaskInfoUpdate from './q-ponctual-task-info-update';
import QPonctualTaskInfoDeleteDialog from './q-ponctual-task-info-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QPonctualTaskInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QPonctualTaskInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QPonctualTaskInfoDetail} />
      <ErrorBoundaryRoute path={match.url} component={QPonctualTaskInfo} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QPonctualTaskInfoDeleteDialog} />
  </>
);

export default Routes;
