import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryFile from './query-file';
import QueryFileDetail from './query-file-detail';
import QueryFileUpdate from './query-file-update';
import QueryFileDeleteDialog from './query-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryFileDeleteDialog} />
  </>
);

export default Routes;
