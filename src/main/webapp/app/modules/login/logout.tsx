import React, { useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import { IRootState } from 'app/shared/reducers';
import { logout } from 'app/shared/reducers/authentication';
import { Redirect } from 'react-router-dom';
import { changeTodoUserId } from 'app/shared/reducers/app-util';

export interface ILogoutProps extends StateProps, DispatchProps {
  idToken: string;
  logoutUrl: string;
}

export const Logout = (props: ILogoutProps) => {
  useLayoutEffect(() => {
    props.logout();
    props.changeTodoUserId(null);
    const logoutUrl = props.logoutUrl;
    if (logoutUrl) {
      // if Keycloak, logoutUrl has protocol/openid-connect in it
      window.location.href = logoutUrl.includes('/protocol')
        ? logoutUrl + '?redirect_uri=' + window.location.origin
        : logoutUrl + '?id_token_hint=' + props.idToken + '&post_logout_redirect_uri=' + window.location.origin;
    }
  });
  const redirectUri = '/login';
  return (
    <Redirect to={redirectUri} />
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  logoutUrl: storeState.authentication.logoutUrl,
  idToken: storeState.authentication.idToken,
});

const mapDispatchToProps = { logout, changeTodoUserId };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
