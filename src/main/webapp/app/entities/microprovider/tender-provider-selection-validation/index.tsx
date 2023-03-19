import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderProviderSelectionValidation from './tender-provider-selection-validation';
import TenderProviderSelectionValidationDetail from './tender-provider-selection-validation-detail';
import TenderProviderSelectionValidationUpdate from './tender-provider-selection-validation-update';
import TenderProviderSelectionValidationDeleteDialog from './tender-provider-selection-validation-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderProviderSelectionValidationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderProviderSelectionValidationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderProviderSelectionValidationDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderProviderSelectionValidation} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderProviderSelectionValidationDeleteDialog} />
  </>
);

export default Routes;
