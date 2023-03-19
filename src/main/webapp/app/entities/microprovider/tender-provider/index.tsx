import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderProvider from './tender-provider';
import TenderProviderDetail from './tender-provider-detail';
import TenderProviderUpdate from './tender-provider-update';
import TenderProviderDeleteDialog from './tender-provider-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderProviderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderProviderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderProviderDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderProvider} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderProviderDeleteDialog} />
  </>
);

export default Routes;
