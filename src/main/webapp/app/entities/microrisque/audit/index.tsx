import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Audit from './custom/audit';
import AuditDetail from './audit-detail';
import AuditUpdate from './audit-update';
import AuditDeleteDialog from './audit-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AuditUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AuditUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AuditDetail} />
      <ErrorBoundaryRoute path={match.url} component={Audit} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AuditDeleteDialog} />
  </>
);

export default Routes;
