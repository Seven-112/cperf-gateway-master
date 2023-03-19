import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryClientType from './custom/query-client-type';
import QueryClientTypeDetail from './query-client-type-detail';
import QueryClientTypeUpdate from './query-client-type-update';
import QueryClientTypeDeleteDialog from './query-client-type-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryClientTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryClientTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryClientTypeDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryClientType} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryClientTypeDeleteDialog} />
  </>
);

export default Routes;
