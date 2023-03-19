import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryUserValidator from './query-user-validator';
import QueryUserValidatorDetail from './query-user-validator-detail';
import QueryUserValidatorUpdate from './query-user-validator-update';
import QueryUserValidatorDeleteDialog from './query-user-validator-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryUserValidatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryUserValidatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryUserValidatorDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryUserValidator} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryUserValidatorDeleteDialog} />
  </>
);

export default Routes;
