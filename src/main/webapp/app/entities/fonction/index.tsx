import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Fonction from './custom/fonction';
import FonctionDetail from './fonction-detail';
import FonctionUpdate from './fonction-update';
import FonctionDeleteDialog from './fonction-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={FonctionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={FonctionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={FonctionDetail} />
      <ErrorBoundaryRoute path={match.url} component={Fonction} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={FonctionDeleteDialog} />
  </>
);

export default Routes;
