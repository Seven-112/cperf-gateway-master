import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import PartenerField from './partener-field';
import PartenerFieldDetail from './partener-field-detail';
import PartenerFieldUpdate from './partener-field-update';
import PartenerFieldDeleteDialog from './partener-field-delete-dialog';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute exact path={`${match.url}/new`} component={PartenerFieldUpdate} 
        hasAnyPrivileges={{ entities: ['Partener'], actions: [PrivilegeAction.CREATE] }}/>
      <PrivateRoute exact path={`${match.url}/:id/edit`} component={PartenerFieldUpdate}
        hasAnyPrivileges={{ entities: ['Partener'], actions: [PrivilegeAction.UPDATE] }} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PartenerFieldDetail} />
      <PrivateRoute path={match.url} component={PartenerField}
        hasAnyPrivileges={{ entities: ['Partener'], actions: [PrivilegeAction.ALL] }} />
    </Switch>
    <PrivateRoute exact path={`${match.url}/:id/delete`} component={PartenerFieldDeleteDialog}
        hasAnyPrivileges={{ entities: ['Partener'], actions: [PrivilegeAction.DELETE] }} />
  </>
);

export default Routes;
