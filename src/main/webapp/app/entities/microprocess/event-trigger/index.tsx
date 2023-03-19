import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import EventTrigger from './event-trigger';
import EventTriggerDetail from './event-trigger-detail';
import EventTriggerUpdate from './event-trigger-update';
import EventTriggerDeleteDialog from './event-trigger-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EventTriggerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EventTriggerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EventTriggerDetail} />
      <ErrorBoundaryRoute path={match.url} component={EventTrigger} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EventTriggerDeleteDialog} />
  </>
);

export default Routes;
