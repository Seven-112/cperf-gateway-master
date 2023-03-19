import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AuditRecommendationFile from './audit-recommendation-file';
import AuditRecommendationFileDetail from './audit-recommendation-file-detail';
import AuditRecommendationFileUpdate from './audit-recommendation-file-update';
import AuditRecommendationFileDeleteDialog from './audit-recommendation-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AuditRecommendationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AuditRecommendationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AuditRecommendationFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={AuditRecommendationFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AuditRecommendationFileDeleteDialog} />
  </>
);

export default Routes;
