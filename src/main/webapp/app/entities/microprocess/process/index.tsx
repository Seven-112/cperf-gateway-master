import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Process from './custom/process';
import ProcessUpdate from './custom/process-update';
import ProcessDeleteDialog from './process-delete-dialog';
import Logigram from './custom/logigram-page';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute exact path={`${match.url}/new`} component={ProcessUpdate}
         hasAnyPrivileges={{ entities: ["Process"], actions: [PrivilegeAction.CREATE] }} />
      <PrivateRoute exact path={`${match.url}/:id/edit`} component={ProcessUpdate}
         hasAnyPrivileges={{ entities: ["Process"], actions: [PrivilegeAction.UPDATE] }} />
      <PrivateRoute exact path={`${match.url}/:id/logigram`} component={Logigram}
         hasAnyPrivileges={{ entities: ["Process"], actions: [PrivilegeAction.ALL] }} />
      <PrivateRoute path={match.url} component={Process} hasAnyPrivileges={{ entities: ["Process"],
             actions: [PrivilegeAction.LISTE, PrivilegeAction.UPDATE, PrivilegeAction.CREATE, PrivilegeAction.DELETE] }} />
    </Switch>
    <PrivateRoute exact path={`${match.url}/:id/delete`} component={ProcessDeleteDialog} 
             hasAnyPrivileges={{ entities: ["Process"], actions: [PrivilegeAction.DELETE] }}/>
  </>
);

export default Routes;
