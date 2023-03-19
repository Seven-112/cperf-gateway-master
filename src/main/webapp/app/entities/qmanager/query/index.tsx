import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Query from './custom/query';
import QueryDetail from './query-detail';
import QueryUpdate from './query-update';
import QueryDeleteDialog from './query-delete-dialog';
import UserQuery from './custom/user-query';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import QueryInstance from '../query-instance/custom/query-insatnce';
import QueryInstanceTovalidate from './custom/query-insatnce-to-validate';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute exact path={`${match.url}/new`} component={QueryUpdate} 
        hasAnyPrivileges={{ entities: ['Query'], actions: [PrivilegeAction.CREATE]}} />
      <ErrorBoundaryRoute exact path={`${match.url}/for-me`} component={UserQuery} />
      <ErrorBoundaryRoute exact path={`${match.url}/to-validate`} component={QueryInstanceTovalidate}  />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/instances`} component={QueryInstance}  />
      <PrivateRoute exact path={`${match.url}/:id/edit`} component={QueryUpdate} 
        hasAnyPrivileges={{ entities: ['Query'], actions: [PrivilegeAction.UPDATE]}} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={QueryDetail} />
      <PrivateRoute exact path={`${match.url}/category/:categoryId`} component={Query} 
       hasAnyPrivileges={{ entities: ['Query'], actions: [PrivilegeAction.ALL]}} />
      <PrivateRoute path={match.url} component={Query} 
        hasAnyPrivileges={{ entities: ['Query'], actions: [PrivilegeAction.ALL]}} />
    </Switch>
    <PrivateRoute exact path={`${match.url}/:id/delete`} component={QueryDeleteDialog} 
      hasAnyPrivileges={{ entities: ['Query'], actions: [PrivilegeAction.DELETE]}} />
  </>
);

export default Routes;
