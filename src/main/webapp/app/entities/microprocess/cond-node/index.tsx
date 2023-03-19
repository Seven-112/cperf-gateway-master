import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CondNode from './cond-node';
import CondNodeDetail from './cond-node-detail';
import CondNodeUpdate from './cond-node-update';
import CondNodeDeleteDialog from './cond-node-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CondNodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CondNodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CondNodeDetail} />
      <ErrorBoundaryRoute path={match.url} component={CondNode} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={CondNodeDeleteDialog} />
  </>
);

export default Routes;
