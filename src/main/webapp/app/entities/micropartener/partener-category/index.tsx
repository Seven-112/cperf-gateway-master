import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import PartenerCategory from './custom/partener-category';
import PartenerCategoryDetail from './partener-category-detail';
import PartenerCategoryUpdate from './partener-category-update';
import PartenerCategoryDeleteDialog from './partener-category-delete-dialog';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute exact path={`${match.url}/new`} component={PartenerCategoryUpdate} 
        hasAnyPrivileges={{ entities: ['Partener'], actions: [PrivilegeAction.CREATE] }}/>
      <PrivateRoute exact path={`${match.url}/:id/edit`} component={PartenerCategoryUpdate}
        hasAnyPrivileges={{ entities: ['Partener'], actions: [PrivilegeAction.UPDATE] }} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PartenerCategoryDetail} />
      <PrivateRoute path={match.url} component={PartenerCategory} 
        hasAnyPrivileges={{ entities: ['Partener'], actions: [PrivilegeAction.ALL] }}/>
    </Switch>
    <PrivateRoute exact path={`${match.url}/:id/delete`} component={PartenerCategoryDeleteDialog} 
        hasAnyPrivileges={{ entities: ['Partener'], actions: [PrivilegeAction.DELETE] }}/>
  </>
);

export default Routes;
