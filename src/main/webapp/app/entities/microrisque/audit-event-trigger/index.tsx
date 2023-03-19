import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AuditEventTrigger from './audit-event-trigger';
import AuditEventTriggerDetail from './audit-event-trigger-detail';
import AuditEventTriggerUpdate from './audit-event-trigger-update';
import AuditEventTriggerDeleteDialog from './audit-event-trigger-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AuditEventTriggerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AuditEventTriggerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AuditEventTriggerDetail} />
      <ErrorBoundaryRoute path={match.url} component={AuditEventTrigger} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AuditEventTriggerDeleteDialog} />
  </>
);

export default Routes;
