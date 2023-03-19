import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderAnswerExecutionFile from './tender-answer-execution-file';
import TenderAnswerExecutionFileDetail from './tender-answer-execution-file-detail';
import TenderAnswerExecutionFileUpdate from './tender-answer-execution-file-update';
import TenderAnswerExecutionFileDeleteDialog from './tender-answer-execution-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderAnswerExecutionFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderAnswerExecutionFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderAnswerExecutionFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderAnswerExecutionFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderAnswerExecutionFileDeleteDialog} />
  </>
);

export default Routes;
