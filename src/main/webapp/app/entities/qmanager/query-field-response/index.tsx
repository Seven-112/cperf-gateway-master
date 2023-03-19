import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryFieldResponse from './query-field-response';
import QueryFieldResponseDetail from './query-field-response-detail';
import QueryFieldResponseUpdate from './query-field-response-update';
import QueryFieldResponseDeleteDialog from './query-field-response-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryFieldResponseUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryFieldResponseUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryFieldResponseDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryFieldResponse} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryFieldResponseDeleteDialog} />
  </>
);

export default Routes;
