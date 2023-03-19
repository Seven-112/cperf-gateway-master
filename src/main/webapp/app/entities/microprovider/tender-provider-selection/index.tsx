import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderProviderSelection from './tender-provider-selection';
import TenderProviderSelectionDetail from './tender-provider-selection-detail';
import TenderProviderSelectionUpdate from './tender-provider-selection-update';
import TenderProviderSelectionDeleteDialog from './tender-provider-selection-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderProviderSelectionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderProviderSelectionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderProviderSelectionDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderProviderSelection} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderProviderSelectionDeleteDialog} />
  </>
);

export default Routes;
