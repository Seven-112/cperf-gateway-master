import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Project from './custom/project';
import ProjectDetail from './project-detail';
import ProjectUpdate from './project-update';
import ProjectDeleteDialog from './project-delete-dialog';
import ProjectOrgChart from './custom/project-org-chart';
import PrivateRoute from 'app/shared/auth/private-route';
import ProjectLogigramPage from './custom/project-logigram-page';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProjectUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/org`} component={ProjectOrgChart} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProjectUpdate} />
      <PrivateRoute exact path={`${match.url}/:id/logigram`} component={ProjectLogigramPage}/>
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProjectDetail} />
      <ErrorBoundaryRoute path={match.url} component={Project} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProjectDeleteDialog} />
  </>
);

export default Routes;
