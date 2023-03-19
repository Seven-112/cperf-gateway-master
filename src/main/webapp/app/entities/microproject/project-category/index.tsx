import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectCategory from './project-category';
import ProjectCategoryDetail from './project-category-detail';
import ProjectCategoryUpdate from './project-category-update';
import ProjectCategoryDeleteDialog from './project-category-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectCategoryDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectCategory} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectCategoryDeleteDialog} />
  </>
);

export default Routes;
