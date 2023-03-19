import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Objectif from './custom/objectif';
import ObjectifDetail from './objectif-detail';
import ObjectifUpdate from './objectif-update';
import ObjectifDeleteDialog from './objectif-delete-dialog';
import ObjectifDashBord from './custom/objectif-indicator';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute exact path={`${match.url}/new`} component={ObjectifUpdate}
        hasAnyPrivileges={{ entities: ['Objectif'], actions: [PrivilegeAction.CREATE] }} />
      <ErrorBoundaryRoute exact path={`${match.url}/indicator`} component={ObjectifDashBord} />
      <PrivateRoute exact path={`${match.url}/:id/edit`} component={ObjectifUpdate}
        hasAnyPrivileges={{ entities: ['Objectif'], actions: [PrivilegeAction.UPDATE] }} />
      <PrivateRoute exact path={`${match.url}/:id`} component={ObjectifDetail} 
        hasAnyPrivileges={{ entities: ['Objectif'], actions: [PrivilegeAction.ALL] }}/>
      <PrivateRoute path={match.url} component={Objectif}
        hasAnyPrivileges={{ entities: ['Objectif'], actions: [PrivilegeAction.ALL] }} />
    </Switch>
    <PrivateRoute exact path={`${match.url}/:id/delete`} component={ObjectifDeleteDialog}
        hasAnyPrivileges={{ entities: ['Objectif'], actions: [PrivilegeAction.DELETE] }} />
  </>
);

export default Routes;
