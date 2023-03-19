import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectItemCheckJustification from './project-item-check-justification';
import ProjectItemCheckJustificationDetail from './project-item-check-justification-detail';
import ProjectItemCheckJustificationUpdate from './project-item-check-justification-update';
import ProjectItemCheckJustificationDeleteDialog from './project-item-check-justification-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectItemCheckJustificationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectItemCheckJustificationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectItemCheckJustificationDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectItemCheckJustification} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectItemCheckJustificationDeleteDialog} />
  </>
);

export default Routes;
