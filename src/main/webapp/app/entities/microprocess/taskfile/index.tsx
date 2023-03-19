import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Taskfile from './taskfile';
import TaskfileDetail from './taskfile-detail';
import TaskfileUpdate from './taskfile-update';
import TaskfileDeleteDialog from './taskfile-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TaskfileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TaskfileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TaskfileDetail} />
      <ErrorBoundaryRoute path={match.url} component={Taskfile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TaskfileDeleteDialog} />
  </>
);

export default Routes;
