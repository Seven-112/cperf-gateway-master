import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import EventParticipant from './event-participant';
import EventParticipantDetail from './event-participant-detail';
import EventParticipantUpdate from './event-participant-update';
import EventParticipantDeleteDialog from './event-participant-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EventParticipantUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EventParticipantUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EventParticipantDetail} />
      <ErrorBoundaryRoute path={match.url} component={EventParticipant} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EventParticipantDeleteDialog} />
  </>
);

export default Routes;
