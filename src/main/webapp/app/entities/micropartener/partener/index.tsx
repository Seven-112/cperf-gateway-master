import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Partener from './custom/partener';
import PartenerDetail from './partener-detail';
import PartenerUpdate from './partener-update';
import PartenerDeleteDialog from './partener-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PartenerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PartenerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PartenerDetail} />
      <ErrorBoundaryRoute path={`${match.url}/category/:categoryId`} component={Partener} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PartenerDeleteDialog} />
  </>
);

export default Routes;
