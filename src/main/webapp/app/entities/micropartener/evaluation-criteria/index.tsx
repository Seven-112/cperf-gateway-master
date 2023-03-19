import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import EvaluationCriteria from './evaluation-criteria';
import EvaluationCriteriaDetail from './evaluation-criteria-detail';
import EvaluationCriteriaUpdate from './evaluation-criteria-update';
import EvaluationCriteriaDeleteDialog from './evaluation-criteria-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EvaluationCriteriaUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EvaluationCriteriaUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EvaluationCriteriaDetail} />
      <ErrorBoundaryRoute path={match.url} component={EvaluationCriteria} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EvaluationCriteriaDeleteDialog} />
  </>
);

export default Routes;
