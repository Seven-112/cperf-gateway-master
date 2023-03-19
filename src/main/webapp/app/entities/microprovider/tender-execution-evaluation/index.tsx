import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderExecutionEvaluation from './tender-execution-evaluation';
import TenderExecutionEvaluationDetail from './tender-execution-evaluation-detail';
import TenderExecutionEvaluationUpdate from './tender-execution-evaluation-update';
import TenderExecutionEvaluationDeleteDialog from './tender-execution-evaluation-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderExecutionEvaluationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderExecutionEvaluationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderExecutionEvaluationDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderExecutionEvaluation} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderExecutionEvaluationDeleteDialog} />
  </>
);

export default Routes;
