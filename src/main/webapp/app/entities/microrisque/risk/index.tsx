import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import RiskDetail from './risk-detail';
import RiskUpdate from './risk-update';
import RiskDeleteDialog from './risk-delete-dialog';
import Risk from './custom/risk';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={RiskUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={RiskUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={RiskDetail} />
      <ErrorBoundaryRoute path={match.url} component={Risk} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={RiskDeleteDialog} />
  </>
);

export default Routes;
