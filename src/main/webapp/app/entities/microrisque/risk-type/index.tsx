import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import RiskType from './risk-type';
import RiskTypeDetail from './risk-type-detail';
import RiskTypeUpdate from './risk-type-update';
import RiskTypeDeleteDialog from './risk-type-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={RiskTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={RiskTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={RiskTypeDetail} />
      <ErrorBoundaryRoute path={match.url} component={RiskType} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={RiskTypeDeleteDialog} />
  </>
);

export default Routes;
