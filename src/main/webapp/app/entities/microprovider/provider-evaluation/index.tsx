import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProviderEvaluation from './provider-evaluation';
import ProviderEvaluationDetail from './provider-evaluation-detail';
import ProviderEvaluationUpdate from './provider-evaluation-update';
import ProviderEvaluationDeleteDialog from './provider-evaluation-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProviderEvaluationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProviderEvaluationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProviderEvaluationDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProviderEvaluation} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProviderEvaluationDeleteDialog} />
  </>
);

export default Routes;
