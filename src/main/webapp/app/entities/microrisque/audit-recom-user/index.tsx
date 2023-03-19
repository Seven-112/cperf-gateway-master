import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AuditRecomUser from './audit-recom-user';
import AuditRecomUserDetail from './audit-recom-user-detail';
import AuditRecomUserUpdate from './audit-recom-user-update';
import AuditRecomUserDeleteDialog from './audit-recom-user-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AuditRecomUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AuditRecomUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AuditRecomUserDetail} />
      <ErrorBoundaryRoute path={match.url} component={AuditRecomUser} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AuditRecomUserDeleteDialog} />
  </>
);

export default Routes;
