import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderAnswer from './tender-answer';
import TenderAnswerDetail from './tender-answer-detail';
import TenderAnswerUpdate from './tender-answer-update';
import TenderAnswerDeleteDialog from './tender-answer-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderAnswerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderAnswerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderAnswerDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderAnswer} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderAnswerDeleteDialog} />
  </>
);

export default Routes;
