import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TaskValidationControl from './task-validation-control';
import TaskValidationControlDetail from './task-validation-control-detail';
import TaskValidationControlUpdate from './task-validation-control-update';
import TaskValidationControlDeleteDialog from './task-validation-control-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TaskValidationControlUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TaskValidationControlUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TaskValidationControlDetail} />
      <ErrorBoundaryRoute path={match.url} component={TaskValidationControl} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TaskValidationControlDeleteDialog} />
  </>
);

export default Routes;
