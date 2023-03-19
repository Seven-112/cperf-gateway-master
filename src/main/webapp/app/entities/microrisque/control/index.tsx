import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Control from './control';
import ControlDetail from './control-detail';
import ControlUpdate from './control-update';
import ControlDeleteDialog from './control-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ControlUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ControlUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ControlDetail} />
      <ErrorBoundaryRoute path={match.url} component={Control} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ControlDeleteDialog} />
  </>
);

export default Routes;
