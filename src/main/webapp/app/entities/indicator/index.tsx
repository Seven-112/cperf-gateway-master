import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Indicator from './indicator';
import IndicatorDetail from './indicator-detail';
import IndicatorUpdate from './indicator-update';
import IndicatorDeleteDialog from './indicator-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={IndicatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={IndicatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={IndicatorDetail} />
      <ErrorBoundaryRoute path={match.url} component={Indicator} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={IndicatorDeleteDialog} />
  </>
);

export default Routes;
