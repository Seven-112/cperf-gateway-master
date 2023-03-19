import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectComment from './project-comment';
import ProjectCommentDetail from './project-comment-detail';
import ProjectCommentUpdate from './project-comment-update';
import ProjectCommentDeleteDialog from './project-comment-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectCommentUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectCommentUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectCommentDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectComment} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectCommentDeleteDialog} />
  </>
);

export default Routes;
