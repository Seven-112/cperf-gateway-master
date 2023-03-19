import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AgendaEventDetail from './agenda-event-detail';
import AgendaEventUpdate from './agenda-event-update';
import AgendaEventDeleteDialog from './agenda-event-delete-dialog';
import Agenda from './custom/agenda';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AgendaEventUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AgendaEventUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AgendaEventDetail} />
      <ErrorBoundaryRoute path={match.url} component={Agenda} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AgendaEventDeleteDialog} />
  </>
);

export default Routes;
