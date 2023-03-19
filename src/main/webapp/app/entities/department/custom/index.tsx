import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Department from './department';
import DepartmentDetail from '../department-detail';
import DepartmentUpdate from './department-update';
import DepartmentDeleteDialog from '../department-delete-dialog';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute exact path={`${match.url}/new`} component={DepartmentUpdate} 
        hasAnyPrivileges={{ entities: ["Department"], actions:[PrivilegeAction.CREATE]}} />
      <PrivateRoute exact path={`${match.url}/:id/edit`} component={DepartmentUpdate}
        hasAnyPrivileges={{ entities: ["Department"], actions:[PrivilegeAction.UPDATE]}} />
      <PrivateRoute exact path={`${match.url}/:id`} component={DepartmentDetail} 
        hasAnyPrivileges={{ entities: ["Department"], actions:[PrivilegeAction.LISTE]}}/>
      <PrivateRoute path={match.url} component={Department} hasAnyPrivileges={{entities: ["Department"], 
        actions: [PrivilegeAction.LISTE, PrivilegeAction.CREATE, PrivilegeAction.UPDATE, PrivilegeAction.UPDATE]}}/>
    </Switch>
    <PrivateRoute exact path={`${match.url}/:id/delete`} component={DepartmentDeleteDialog}
        hasAnyPrivileges={{ entities: ["Department"], actions:[PrivilegeAction.DELETE]}} />
  </>
);

export default Routes;
