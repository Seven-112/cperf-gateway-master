import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TenderAnswerField from './tender-answer-field';
import TenderAnswerFieldDetail from './tender-answer-field-detail';
import TenderAnswerFieldUpdate from './tender-answer-field-update';
import TenderAnswerFieldDeleteDialog from './tender-answer-field-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderAnswerFieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderAnswerFieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderAnswerFieldDetail} />
      <ErrorBoundaryRoute path={match.url} component={TenderAnswerField} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderAnswerFieldDeleteDialog} />
  </>
);

export default Routes;
