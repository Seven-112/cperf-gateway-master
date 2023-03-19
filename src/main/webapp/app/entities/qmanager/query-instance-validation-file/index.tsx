import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import QueryInstanceValidationFile from './query-instance-validation-file';
import QueryInstanceValidationFileDetail from './query-instance-validation-file-detail';
import QueryInstanceValidationFileUpdate from './query-instance-validation-file-update';
import QueryInstanceValidationFileDeleteDialog from './query-instance-validation-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={QueryInstanceValidationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={QueryInstanceValidationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryInstanceValidationFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={QueryInstanceValidationFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={QueryInstanceValidationFileDeleteDialog} />
  </>
);

export default Routes;
