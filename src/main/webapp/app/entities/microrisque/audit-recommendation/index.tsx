import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AllRecommendation from './custom/all-recommendation';
import AuditRecommendationDetail from './audit-recommendation-detail';
import AuditRecommendationUpdate from './audit-recommendation-update';
import AuditRecommendationDeleteDialog from './audit-recommendation-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AuditRecommendationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AuditRecommendationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AuditRecommendationDetail} />
      <ErrorBoundaryRoute path={match.url} component={AllRecommendation} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AuditRecommendationDeleteDialog} />
  </>
);

export default Routes;
