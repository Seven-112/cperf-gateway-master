import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Consommable from './custom/consommable';
import ConsommableDetail from './consommable-detail';
import ConsommableUpdate from './consommable-update';
import ConsommableDeleteDialog from './consommable-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ConsommableUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ConsommableUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ConsommableDetail} />
      <ErrorBoundaryRoute path={match.url} component={Consommable} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ConsommableDeleteDialog} />
  </>
);

export default Routes;
