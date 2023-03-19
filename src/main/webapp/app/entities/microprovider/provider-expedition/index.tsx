import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProviderExpedition from './provider-expedition';
import ProviderExpeditionDetail from './provider-expedition-detail';
import ProviderExpeditionUpdate from './provider-expedition-update';
import ProviderExpeditionDeleteDialog from './provider-expedition-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProviderExpeditionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProviderExpeditionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProviderExpeditionDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProviderExpedition} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProviderExpeditionDeleteDialog} />
  </>
);

export default Routes;
