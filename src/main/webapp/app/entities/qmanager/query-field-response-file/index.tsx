import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryFieldResponseFile from './query-field-response-file';
import QueryFieldResponseFileDetail from './query-field-response-file-detail';
import QueryFieldResponseFileUpdate from './query-field-response-file-update';
import QueryFieldResponseFileDeleteDialog from './query-field-response-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryFieldResponseFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryFieldResponseFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryFieldResponseFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryFieldResponseFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryFieldResponseFileDeleteDialog} />
  </>
);

export default Routes;
