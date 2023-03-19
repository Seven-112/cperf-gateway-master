import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import KPI from './kpi';
import KPIDetail from './kpi-detail';
import KPIUpdate from './kpi-update';
import KPIDeleteDialog from './kpi-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={KPIUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={KPIUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={KPIDetail} />
      <ErrorBoundaryRoute path={match.url} component={KPI} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={KPIDeleteDialog} />
  </>
);

export default Routes;
