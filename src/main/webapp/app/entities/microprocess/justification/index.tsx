import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Justification from './justification';
import JustificationDetail from './justification-detail';
import JustificationUpdate from './justification-update';
import JustificationDeleteDialog from './justification-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={JustificationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={JustificationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={JustificationDetail} />
      <ErrorBoundaryRoute path={match.url} component={Justification} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={JustificationDeleteDialog} />
  </>
);

export default Routes;
