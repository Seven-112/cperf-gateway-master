import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectFile from './project-file';
import ProjectFileDetail from './project-file-detail';
import ProjectFileUpdate from './project-file-update';
import ProjectFileDeleteDialog from './project-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectFileDeleteDialog} />
  </>
);

export default Routes;
