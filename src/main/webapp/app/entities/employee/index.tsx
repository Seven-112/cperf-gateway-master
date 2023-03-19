import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Employee from './custom/employee';
import EmployeeDetail from './employee-detail';
import EmployeeUpdate from './custom/employee-update';
import EmployeeDeleteDialog from './employee-delete-dialog';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import EmployeeFreeOrgChart from './custom/employee-free-org-chart';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute exact path={`${match.url}/new`} component={EmployeeUpdate} 
        hasAnyPrivileges={{ entities:["Employee"],actions:[PrivilegeAction.CREATE] }} />
      <PrivateRoute exact path={`${match.url}/organigram`} component={EmployeeFreeOrgChart} 
          hasAnyPrivileges={{ entities:["Organigram"],actions:[PrivilegeAction.LISTE,
          PrivilegeAction.CREATE, PrivilegeAction.UPDATE, PrivilegeAction.DELETE] }} />
      <PrivateRoute exact path={`${match.url}/:id/edit`} component={EmployeeUpdate} 
        hasAnyPrivileges={{ entities:["Employee"],actions:[ PrivilegeAction.UPDATE] }} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EmployeeDetail} />
      <PrivateRoute path={match.url} component={Employee}
      hasAnyPrivileges={{ entities:["Employee"],actions:[PrivilegeAction.LISTE,
       PrivilegeAction.CREATE, PrivilegeAction.UPDATE, PrivilegeAction.DELETE] }} />
    </Switch>
    <PrivateRoute exact path={`${match.url}/:id/delete`} component={EmployeeDeleteDialog} 
      hasAnyPrivileges={{ entities:["Employee"],actions:[PrivilegeAction.DELETE] }}/>
  </>
);

export default Routes;
