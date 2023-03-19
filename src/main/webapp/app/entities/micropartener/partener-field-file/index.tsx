import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import PartenerFieldFile from './partener-field-file';
import PartenerFieldFileDetail from './partener-field-file-detail';
import PartenerFieldFileUpdate from './partener-field-file-update';
import PartenerFieldFileDeleteDialog from './partener-field-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PartenerFieldFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PartenerFieldFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PartenerFieldFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={PartenerFieldFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PartenerFieldFileDeleteDialog} />
  </>
);

export default Routes;
