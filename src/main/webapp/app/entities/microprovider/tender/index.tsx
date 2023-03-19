import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Tender from './custom/tender';
import TenderDetail from './tender-detail';
import TenderUpdate from './tender-update';
import TenderDeleteDialog from './tender-delete-dialog';
import TenderAnswer from '../tender-answer/custom/tender-answer';
import TenderAnswerField from '../tender-answer-field/custom/tender-answer-field';
import PrivateRoute from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { AUTHORITIES } from 'app/config/constants';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TenderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TenderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/answer/:tenderId`} component={TenderAnswer} />
      <PrivateRoute exact path={`${match.url}/answer-field/:tenderId`}
             hasAnyPrivileges={{entities: ['Tender'], actions: [PrivilegeAction.ALL]}}
            component={TenderAnswerField} hasAnyAuthorities={[AUTHORITIES.EVALUATOR]}/>
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TenderDetail} />
      <ErrorBoundaryRoute path={match.url} component={Tender} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TenderDeleteDialog} />
  </>
);

export default Routes;
