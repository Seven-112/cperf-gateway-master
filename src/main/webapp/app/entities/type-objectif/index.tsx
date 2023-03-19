import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TypeObjectif from './custom/type-objectif';
import TypeObjectifDetail from './type-objectif-detail';
import TypeObjectifUpdate from './type-objectif-update';
import TypeObjectifDeleteDialog from './type-objectif-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TypeObjectifUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TypeObjectifUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TypeObjectifDetail} />
      <ErrorBoundaryRoute path={match.url} component={TypeObjectif} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TypeObjectifDeleteDialog} />
  </>
);

export default Routes;
