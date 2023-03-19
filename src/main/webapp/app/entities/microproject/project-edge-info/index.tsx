import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectEdgeInfo from './project-edge-info';
import ProjectEdgeInfoDetail from './project-edge-info-detail';
import ProjectEdgeInfoUpdate from './project-edge-info-update';
import ProjectEdgeInfoDeleteDialog from './project-edge-info-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectEdgeInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectEdgeInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectEdgeInfoDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectEdgeInfo} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectEdgeInfoDeleteDialog} />
  </>
);

export default Routes;
