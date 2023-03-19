import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import MshzFile from './mshz-file';
import MshzFileDetail from './mshz-file-detail';
import MshzFileUpdate from './mshz-file-update';
import MshzFileDeleteDialog from './mshz-file-delete-dialog';
import CustomMshzFileUpdate from './custom/custom-mshz-file-update';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CustomMshzFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CustomMshzFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={MshzFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={MshzFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={MshzFileDeleteDialog} />
  </>
);

export default Routes;
