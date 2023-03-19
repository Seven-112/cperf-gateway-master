import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import WorkCalender from './custom/work-calender';
import WorkCalenderDetail from './work-calender-detail';
import WorkCalenderUpdate from './work-calender-update';
import WorkCalenderDeleteDialog from './work-calender-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={WorkCalenderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={WorkCalenderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={WorkCalenderDetail} />
      <ErrorBoundaryRoute path={match.url} component={WorkCalender} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={WorkCalenderDeleteDialog} />
  </>
);

export default Routes;
