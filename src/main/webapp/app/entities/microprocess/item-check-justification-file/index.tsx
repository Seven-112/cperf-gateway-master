import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ItemCheckJustificationFile from './item-check-justification-file';
import ItemCheckJustificationFileDetail from './item-check-justification-file-detail';
import ItemCheckJustificationFileUpdate from './item-check-justification-file-update';
import ItemCheckJustificationFileDeleteDialog from './item-check-justification-file-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ItemCheckJustificationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ItemCheckJustificationFileUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ItemCheckJustificationFileDetail} />
      <ErrorBoundaryRoute path={match.url} component={ItemCheckJustificationFile} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ItemCheckJustificationFileDeleteDialog} />
  </>
);

export default Routes;
