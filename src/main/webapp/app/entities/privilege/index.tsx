import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Privilege from './custom/privilege';
import PrivilegeDetail from './privilege-detail';
import PrivilegeUpdate from './privilege-update';
import PrivilegeDeleteDialog from './privilege-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PrivilegeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PrivilegeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PrivilegeDetail} />
      <ErrorBoundaryRoute path={match.url} component={Privilege} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PrivilegeDeleteDialog} />
  </>
);

export default Routes;
