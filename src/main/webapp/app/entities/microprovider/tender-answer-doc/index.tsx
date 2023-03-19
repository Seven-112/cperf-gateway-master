import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderAnswerDoc from './tender-answer-doc';
import TenderAnswerDocDetail from './tender-answer-doc-detail';
import TenderAnswerDocUpdate from './tender-answer-doc-update';
import TenderAnswerDocDeleteDialog from './tender-answer-doc-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderAnswerDocUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderAnswerDocUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderAnswerDocDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderAnswerDoc} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderAnswerDocDeleteDialog} />
  </>
);

export default Routes;
