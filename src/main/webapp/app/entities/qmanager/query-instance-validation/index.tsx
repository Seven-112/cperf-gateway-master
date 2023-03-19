import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryInstanceValidation from './query-instance-validation';
import QueryInstanceValidationDetail from './query-instance-validation-detail';
import QueryInstanceValidationUpdate from './query-instance-validation-update';
import QueryInstanceValidationDeleteDialog from './query-instance-validation-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryInstanceValidationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryInstanceValidationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryInstanceValidationDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryInstanceValidation} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryInstanceValidationDeleteDialog} />
  </>
);

export default Routes;
