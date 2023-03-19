import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderDoc from './tender-doc';
import TenderDocDetail from './tender-doc-detail';
import TenderDocUpdate from './tender-doc-update';
import TenderDocDeleteDialog from './tender-doc-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderDocUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderDocUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderDocDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderDoc} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderDocDeleteDialog} />
  </>
);

export default Routes;
