import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryInstance from './custom/query-insatnce';
import QueryInstanceDetail from './query-instance-detail';
import QueryInstanceUpdate from './query-instance-update';
import QueryInstanceDeleteDialog from './query-instance-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryInstanceUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryInstanceUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryInstanceDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryInstance} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryInstanceDeleteDialog} />
  </>
);

export default Routes;
