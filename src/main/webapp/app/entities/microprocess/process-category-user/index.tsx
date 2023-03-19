import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProcessCategoryUser from './process-category-user';
import ProcessCategoryUserDetail from './process-category-user-detail';
import ProcessCategoryUserUpdate from './process-category-user-update';
import ProcessCategoryUserDeleteDialog from './process-category-user-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProcessCategoryUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProcessCategoryUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProcessCategoryUserDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProcessCategoryUser} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProcessCategoryUserDeleteDialog} />
  </>
);

export default Routes;
