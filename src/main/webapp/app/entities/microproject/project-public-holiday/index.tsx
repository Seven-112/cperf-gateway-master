import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectPublicHoliday from './project-public-holiday';
import ProjectPublicHolidayDetail from './project-public-holiday-detail';
import ProjectPublicHolidayUpdate from './project-public-holiday-update';
import ProjectPublicHolidayDeleteDialog from './project-public-holiday-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectPublicHolidayUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectPublicHolidayUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectPublicHolidayDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectPublicHoliday} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectPublicHolidayDeleteDialog} />
  </>
);

export default Routes;
