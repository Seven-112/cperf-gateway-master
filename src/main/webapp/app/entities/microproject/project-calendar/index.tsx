import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProjectCalendar from './custom/project-calendar';
import ProjectCalendarDetail from './project-calendar-detail';
import ProjectCalendarUpdate from './project-calendar-update';
import ProjectCalendarDeleteDialog from './project-calendar-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectCalendarUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectCalendarUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectCalendarDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProjectCalendar} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectCalendarDeleteDialog} />
  </>
);

export default Routes;
