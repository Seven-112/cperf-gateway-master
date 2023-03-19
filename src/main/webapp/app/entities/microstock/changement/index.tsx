import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Changement from './custom/changement';
import ChangementDetail from './changement-detail';
import ChangementUpdate from './changement-update';
import ChangementDeleteDialog from './changement-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ChangementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ChangementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ChangementDetail} />
      <ErrorBoundaryRoute path={match.url} component={Changement} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ChangementDeleteDialog} />
  </>
);

export default Routes;
