import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ExecutionValidation from './execution-validation';
import ExecutionValidationDetail from './execution-validation-detail';
import ExecutionValidationUpdate from './execution-validation-update';
import ExecutionValidationDeleteDialog from './execution-validation-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ExecutionValidationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ExecutionValidationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ExecutionValidationDetail} />
      <ErrorBoundaryRoute path={match.url} component={ExecutionValidation} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ExecutionValidationDeleteDialog} />
  </>
);

export default Routes;
