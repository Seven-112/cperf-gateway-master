import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProcessCategory from './custom/process-category';
import ProcessCategoryDetail from './process-category-detail';
import ProcessCategoryUpdate from './process-category-update';
import ProcessCategoryDeleteDialog from './process-category-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProcessCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProcessCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProcessCategoryDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProcessCategory} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProcessCategoryDeleteDialog} />
  </>
);

export default Routes;
