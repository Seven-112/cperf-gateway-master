import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import PartenerCategoryValidator from './partener-category-validator';
import PartenerCategoryValidatorDetail from './partener-category-validator-detail';
import PartenerCategoryValidatorUpdate from './partener-category-validator-update';
import PartenerCategoryValidatorDeleteDialog from './partener-category-validator-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PartenerCategoryValidatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PartenerCategoryValidatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PartenerCategoryValidatorDetail} />
      <ErrorBoundaryRoute path={match.url} component={PartenerCategoryValidator} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PartenerCategoryValidatorDeleteDialog} />
  </>
);

export default Routes;
