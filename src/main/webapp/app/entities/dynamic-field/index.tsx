import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import DynamicField from './dynamic-field';
import DynamicFieldDetail from './dynamic-field-detail';
import DynamicFieldUpdate from './dynamic-field-update';
import DynamicFieldDeleteDialog from './dynamic-field-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={DynamicFieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={DynamicFieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DynamicFieldDetail} />
      <ErrorBoundaryRoute path={match.url} component={DynamicField} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={DynamicFieldDeleteDialog} />
  </>
);

export default Routes;
