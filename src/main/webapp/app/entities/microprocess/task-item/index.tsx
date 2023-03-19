import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TaskItem from './task-item';
import TaskItemDetail from './task-item-detail';
import TaskItemUpdate from './task-item-update';
import TaskItemDeleteDialog from './task-item-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TaskItemUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TaskItemUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TaskItemDetail} />
      <ErrorBoundaryRoute path={match.url} component={TaskItem} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TaskItemDeleteDialog} />
  </>
);

export default Routes;
