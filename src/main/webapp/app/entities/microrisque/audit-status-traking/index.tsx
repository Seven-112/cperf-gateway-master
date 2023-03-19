import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AuditStatusTraking from './audit-status-traking';
import AuditStatusTrakingDetail from './audit-status-traking-detail';
import AuditStatusTrakingUpdate from './audit-status-traking-update';
import AuditStatusTrakingDeleteDialog from './audit-status-traking-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AuditStatusTrakingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AuditStatusTrakingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AuditStatusTrakingDetail} />
      <ErrorBoundaryRoute path={match.url} component={AuditStatusTraking} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AuditStatusTrakingDeleteDialog} />
  </>
);

export default Routes;
