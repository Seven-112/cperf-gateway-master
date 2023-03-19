import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import EventFile from './event-file';
import EventFileDetail from './event-file-detail';
import EventFileUpdate from './event-file-update';
import EventFileDeleteDialog from './event-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EventFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EventFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EventFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={EventFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EventFileDeleteDialog} />
  </>
);

export default Routes;
