import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QCategory from './custom/q-category';
import QCategoryDetail from './q-category-detail';
import QCategoryUpdate from './q-category-update';
import QCategoryDeleteDialog from './q-category-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QCategoryDetail} />
      <ErrorBoundaryRoute path={match.url} component={QCategory} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QCategoryDeleteDialog} />
  </>
);

export default Routes;
