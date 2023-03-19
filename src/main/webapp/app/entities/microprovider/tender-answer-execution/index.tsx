import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderAnswerExecution from './tender-answer-execution';
import TenderAnswerExecutionDetail from './tender-answer-execution-detail';
import TenderAnswerExecutionUpdate from './tender-answer-execution-update';
import TenderAnswerExecutionDeleteDialog from './tender-answer-execution-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderAnswerExecutionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderAnswerExecutionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderAnswerExecutionDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderAnswerExecution} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderAnswerExecutionDeleteDialog} />
  </>
);

export default Routes;
