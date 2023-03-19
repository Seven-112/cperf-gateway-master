import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ExecutionValidationFile from './execution-validation-file';
import ExecutionValidationFileDetail from './execution-validation-file-detail';
import ExecutionValidationFileUpdate from './execution-validation-file-update';
import ExecutionValidationFileDeleteDialog from './execution-validation-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ExecutionValidationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ExecutionValidationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ExecutionValidationFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={ExecutionValidationFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ExecutionValidationFileDeleteDialog} />
  </>
);

export default Routes;
