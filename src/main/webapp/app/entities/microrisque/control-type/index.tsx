import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ControlType from './control-type';
import ControlTypeDetail from './control-type-detail';
import ControlTypeUpdate from './control-type-update';
import ControlTypeDeleteDialog from './control-type-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ControlTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ControlTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ControlTypeDetail} />
      <ErrorBoundaryRoute path={match.url} component={ControlType} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ControlTypeDeleteDialog} />
  </>
);

export default Routes;
