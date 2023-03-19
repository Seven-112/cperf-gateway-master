import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectTaskSubmission from './project-task-submission';
import ProjectTaskSubmissionDetail from './project-task-submission-detail';
import ProjectTaskSubmissionUpdate from './project-task-submission-update';
import ProjectTaskSubmissionDeleteDialog from './project-task-submission-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectTaskSubmissionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectTaskSubmissionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectTaskSubmissionDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectTaskSubmission} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectTaskSubmissionDeleteDialog} />
  </>
);

export default Routes;
