import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Field from './custom/field';
import FieldDetail from './field-detail';
import FieldUpdate from './field-update';
import FieldDeleteDialog from './field-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={FieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={FieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={FieldDetail} />
      <ErrorBoundaryRoute path={match.url} component={Field} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={FieldDeleteDialog} />
  </>
);

export default Routes;
