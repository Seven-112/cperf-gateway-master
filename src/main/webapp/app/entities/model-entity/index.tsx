import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ModelEntity from './custom/model-entity';
import ModelEntityDetail from './model-entity-detail';
import ModelEntityUpdate from './model-entity-update';
import ModelEntityDeleteDialog from './model-entity-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ModelEntityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ModelEntityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ModelEntityDetail} />
      <ErrorBoundaryRoute path={match.url} component={ModelEntity} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ModelEntityDeleteDialog} />
  </>
);

export default Routes;
