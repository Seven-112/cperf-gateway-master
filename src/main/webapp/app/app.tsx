import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import MyApp from './my-app';


const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export interface IAppProps extends StateProps, DispatchProps {}

export const App = (props: IAppProps) => {

  useEffect(() => {
    props.getSession();
    props.getProfile();
  }, []);

  return (
    <Router basename={baseHref}>
        <MyApp currentLocale={props.currentLocale}
          isAdmin={props.isAdmin} isAuthenticated={props.isAuthenticated}
          isInProduction={props.isInProduction} isSwaggerEnabled={props.isSwaggerEnabled}
          ribbonEnv={props.ribbonEnv} setLocale={props.setLocale} 
          account={props.account} notifications={[...props.notifications]}/>
    </Router>
  );
};

const mapStateToProps = ({ authentication, applicationProfile, locale, userExtra, notification }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
  account: authentication.account,
  userExtraEntity: userExtra.entity,
  notifications: notification.entities,
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
