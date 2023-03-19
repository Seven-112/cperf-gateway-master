import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProviderExecutionAverage from './custom/provider-execution-average';
import ProviderExecutionAverageDetail from './provider-execution-average-detail';
import ProviderExecutionAverageUpdate from './provider-execution-average-update';
import ProviderExecutionAverageDeleteDialog from './provider-execution-average-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProviderExecutionAverageUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProviderExecutionAverageUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProviderExecutionAverageDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProviderExecutionAverage} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProviderExecutionAverageDeleteDialog} />
  </>
);

export default Routes;
