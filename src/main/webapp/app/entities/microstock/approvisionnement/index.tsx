import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Approvisionnement from './approvisionnement';
import ApprovisionnementDetail from './approvisionnement-detail';
import ApprovisionnementUpdate from './approvisionnement-update';
import ApprovisionnementDeleteDialog from './approvisionnement-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ApprovisionnementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ApprovisionnementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ApprovisionnementDetail} />
      <ErrorBoundaryRoute path={match.url} component={Approvisionnement} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ApprovisionnementDeleteDialog} />
  </>
);

export default Routes;
