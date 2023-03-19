import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryField from './query-field';
import QueryFieldDetail from './query-field-detail';
import QueryFieldUpdate from './query-field-update';
import QueryFieldDeleteDialog from './query-field-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryFieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryFieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryFieldDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryField} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryFieldDeleteDialog} />
  </>
);

export default Routes;
