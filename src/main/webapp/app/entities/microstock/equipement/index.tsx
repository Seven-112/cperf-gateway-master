import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Equipement from './custom/equipement';
import EquipementDetail from './equipement-detail';
import EquipementUpdate from './equipement-update';
import EquipementDeleteDialog from './equipement-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EquipementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EquipementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EquipementDetail} />
      <ErrorBoundaryRoute path={match.url} component={Equipement} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EquipementDeleteDialog} />
  </>
);

export default Routes;
