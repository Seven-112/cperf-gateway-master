import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import EventExeption from './event-exeption';
import EventExeptionDetail from './event-exeption-detail';
import EventExeptionUpdate from './event-exeption-update';
import EventExeptionDeleteDialog from './event-exeption-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EventExeptionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EventExeptionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EventExeptionDetail} />
      <ErrorBoundaryRoute path={match.url} component={EventExeption} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EventExeptionDeleteDialog} />
  </>
);

export default Routes;
