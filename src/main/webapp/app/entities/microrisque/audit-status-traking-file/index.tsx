import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AuditStatusTrakingFile from './audit-status-traking-file';
import AuditStatusTrakingFileDetail from './audit-status-traking-file-detail';
import AuditStatusTrakingFileUpdate from './audit-status-traking-file-update';
import AuditStatusTrakingFileDeleteDialog from './audit-status-traking-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AuditStatusTrakingFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AuditStatusTrakingFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AuditStatusTrakingFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={AuditStatusTrakingFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AuditStatusTrakingFileDeleteDialog} />
  </>
);

export default Routes;
