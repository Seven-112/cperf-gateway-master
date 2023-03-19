import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderFile from './tender-file';
import TenderFileDetail from './tender-file-detail';
import TenderFileUpdate from './tender-file-update';
import TenderFileDeleteDialog from './tender-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderFileDeleteDialog} />
  </>
);

export default Routes;
