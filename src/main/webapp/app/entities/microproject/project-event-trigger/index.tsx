import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectEventTrigger from './project-event-trigger';
import ProjectEventTriggerDetail from './project-event-trigger-detail';
import ProjectEventTriggerUpdate from './project-event-trigger-update';
import ProjectEventTriggerDeleteDialog from './project-event-trigger-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectEventTriggerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectEventTriggerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectEventTriggerDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectEventTrigger} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectEventTriggerDeleteDialog} />
  </>
);

export default Routes;
