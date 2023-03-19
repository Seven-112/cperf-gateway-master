import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectCommentFile from './project-comment-file';
import ProjectCommentFileDetail from './project-comment-file-detail';
import ProjectCommentFileUpdate from './project-comment-file-update';
import ProjectCommentFileDeleteDialog from './project-comment-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectCommentFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectCommentFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectCommentFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectCommentFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectCommentFileDeleteDialog} />
  </>
);

export default Routes;
