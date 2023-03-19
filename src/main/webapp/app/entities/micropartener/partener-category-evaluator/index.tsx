import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import PartenerCategoryEvaluator from './partener-category-evaluator';
import PartenerCategoryEvaluatorDetail from './partener-category-evaluator-detail';
import PartenerCategoryEvaluatorUpdate from './partener-category-evaluator-update';
import PartenerCategoryEvaluatorDeleteDialog from './partener-category-evaluator-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PartenerCategoryEvaluatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PartenerCategoryEvaluatorUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PartenerCategoryEvaluatorDetail} />
      <ErrorBoundaryRoute path={match.url} component={PartenerCategoryEvaluator} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PartenerCategoryEvaluatorDeleteDialog} />
  </>
);

export default Routes;
