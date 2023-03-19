import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ControlMaturity from './control-maturity';
import ControlMaturityDetail from './control-maturity-detail';
import ControlMaturityUpdate from './control-maturity-update';
import ControlMaturityDeleteDialog from './control-maturity-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ControlMaturityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ControlMaturityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ControlMaturityDetail} />
      <ErrorBoundaryRoute path={match.url} component={ControlMaturity} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ControlMaturityDeleteDialog} />
  </>
);

export default Routes;
