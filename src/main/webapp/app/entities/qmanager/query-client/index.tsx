import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryClient from './custom/query-client';
import QueryClientDetail from './query-client-detail';
import QueryClientUpdate from './query-client-update';
import QueryClientDeleteDialog from './query-client-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryClientUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryClientUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryClientDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryClient} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryClientDeleteDialog} />
  </>
);

export default Routes;
