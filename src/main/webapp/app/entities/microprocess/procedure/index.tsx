import React from 'react';
import { Switch } from 'react-router-dom';

import Procedure from './custom/procedure';
import ProcedureDetail from './procedure-detail';
import ProcedureUpdate from './procedure-update';
import ProcedureDeleteDialog from './procedure-delete-dialog';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute exact path={`${match.url}/new`} component={ProcedureUpdate} 
        hasAnyPrivileges={{ entities: ['Procedure'], actions: [PrivilegeAction.CREATE] }} />
      <PrivateRoute exact path={`${match.url}/:id/edit`} component={ProcedureUpdate}
        hasAnyPrivileges={{ entities: ['Procedure'], actions: [PrivilegeAction.UPDATE] }} />
      <PrivateRoute exact path={`${match.url}/:id`} component={ProcedureDetail}
        hasAnyPrivileges={{ entities: ['Procedure'], actions: [PrivilegeAction.LISTE] }} />
      <PrivateRoute path={match.url} component={Procedure}
        hasAnyPrivileges={{ entities: ['Procedure'], actions: [PrivilegeAction.ALL] }} />
    </Switch>
    <PrivateRoute exact path={`${match.url}/:id/delete`} component={ProcedureDeleteDialog}
        hasAnyPrivileges={{ entities: ['Procedure'], actions: [PrivilegeAction.DELETE] }} />
  </>
);

export default Routes;
