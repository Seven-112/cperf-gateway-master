import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import PublicHoliday from './public-holiday';
import PublicHolidayDetail from './public-holiday-detail';
import PublicHolidayUpdate from './public-holiday-update';
import PublicHolidayDeleteDialog from './public-holiday-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PublicHolidayUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PublicHolidayUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PublicHolidayDetail} />
      <ErrorBoundaryRoute path={match.url} component={PublicHoliday} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PublicHolidayDeleteDialog} />
  </>
);

export default Routes;
