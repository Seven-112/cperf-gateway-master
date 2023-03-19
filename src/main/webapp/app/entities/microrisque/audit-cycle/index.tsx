import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AuditCycle from './custom/audit-cycle';
import AuditCycleDetail from './audit-cycle-detail';
import AuditCycleUpdate from './audit-cycle-update';
import AuditCycleDeleteDialog from './audit-cycle-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AuditCycleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AuditCycleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AuditCycleDetail} />
      <ErrorBoundaryRoute path={match.url} component={AuditCycle} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AuditCycleDeleteDialog} />
  </>
);

export default Routes;
