import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import EdgeInfo from './edge-info';
import EdgeInfoDetail from './edge-info-detail';
import EdgeInfoUpdate from './edge-info-update';
import EdgeInfoDeleteDialog from './edge-info-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EdgeInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EdgeInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EdgeInfoDetail} />
      <ErrorBoundaryRoute path={match.url} component={EdgeInfo} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EdgeInfoDeleteDialog} />
  </>
);

export default Routes;
