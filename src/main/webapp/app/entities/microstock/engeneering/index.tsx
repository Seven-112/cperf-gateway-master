import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Engeneering from './custom/engeneering';
import EngeneeringDetail from './engeneering-detail';
import EngeneeringUpdate from './engeneering-update';
import EngeneeringDeleteDialog from './engeneering-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EngeneeringUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EngeneeringUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EngeneeringDetail} />
      <ErrorBoundaryRoute path={match.url} component={Engeneering} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EngeneeringDeleteDialog} />
  </>
);

export default Routes;
