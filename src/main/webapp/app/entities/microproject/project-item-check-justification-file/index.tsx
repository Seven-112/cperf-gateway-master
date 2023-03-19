import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectItemCheckJustificationFile from './project-item-check-justification-file';
import ProjectItemCheckJustificationFileDetail from './project-item-check-justification-file-detail';
import ProjectItemCheckJustificationFileUpdate from './project-item-check-justification-file-update';
import ProjectItemCheckJustificationFileDeleteDialog from './project-item-check-justification-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectItemCheckJustificationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectItemCheckJustificationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectItemCheckJustificationFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectItemCheckJustificationFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectItemCheckJustificationFileDeleteDialog} />
  </>
);

export default Routes;
