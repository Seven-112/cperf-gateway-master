import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryUser from './query-user';
import QueryUserDetail from './query-user-detail';
import QueryUserUpdate from './query-user-update';
import QueryUserDeleteDialog from './query-user-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryUserDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryUser} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryUserDeleteDialog} />
  </>
);

export default Routes;
