import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Typeindicator from './custom/typeIndicator';
import TypeindicatorDetail from './typeindicator-detail';
import TypeindicatorUpdate from './typeindicator-update';
import TypeindicatorDeleteDialog from './typeindicator-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TypeindicatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TypeindicatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TypeindicatorDetail} />
      <ErrorBoundaryRoute path={match.url} component={Typeindicator} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TypeindicatorDeleteDialog} />
  </>
);

export default Routes;
