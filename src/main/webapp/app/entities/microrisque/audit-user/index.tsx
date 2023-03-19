import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AuditUser from './audit-user';
import AuditUserDetail from './audit-user-detail';
import AuditUserUpdate from './audit-user-update';
import AuditUserDeleteDialog from './audit-user-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AuditUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AuditUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AuditUserDetail} />
      <ErrorBoundaryRoute path={match.url} component={AuditUser} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AuditUserDeleteDialog} />
  </>
);

export default Routes;
