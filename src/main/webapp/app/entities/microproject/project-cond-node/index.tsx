import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectCondNode from './project-cond-node';
import ProjectCondNodeDetail from './project-cond-node-detail';
import ProjectCondNodeUpdate from './project-cond-node-update';
import ProjectCondNodeDeleteDialog from './project-cond-node-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectCondNodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectCondNodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectCondNodeDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectCondNode} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectCondNodeDeleteDialog} />
  </>
);

export default Routes;
