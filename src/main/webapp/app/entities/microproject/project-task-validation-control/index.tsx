import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectTaskValidationControl from './project-task-validation-control';
import ProjectTaskValidationControlDetail from './project-task-validation-control-detail';
import ProjectTaskValidationControlUpdate from './project-task-validation-control-update';
import ProjectTaskValidationControlDeleteDialog from './project-task-validation-control-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectTaskValidationControlUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectTaskValidationControlUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectTaskValidationControlDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectTaskValidationControl} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectTaskValidationControlDeleteDialog} />
  </>
);

export default Routes;
