import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ItemCheckJustification from './item-check-justification';
import ItemCheckJustificationDetail from './item-check-justification-detail';
import ItemCheckJustificationUpdate from './item-check-justification-update';
import ItemCheckJustificationDeleteDialog from './item-check-justification-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ItemCheckJustificationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ItemCheckJustificationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ItemCheckJustificationDetail} />
      <ErrorBoundaryRoute path={match.url} component={ItemCheckJustification} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ItemCheckJustificationDeleteDialog} />
  </>
);

export default Routes;
