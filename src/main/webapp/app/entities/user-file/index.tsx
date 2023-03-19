import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UserFile from './user-file';
import UserFileDetail from './user-file-detail';
import UserFileUpdate from './user-file-update';
import UserFileDeleteDialog from './user-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UserFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UserFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UserFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={UserFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UserFileDeleteDialog} />
  </>
);

export default Routes;
