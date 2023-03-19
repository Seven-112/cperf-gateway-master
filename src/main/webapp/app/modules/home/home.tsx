import './home.scss';

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers'; 
import { getEntity as getUserExtra } from 'app/entities/user-extra/user-extra.reducer';
import ProcessDashbord from 'app/shared/component/statistics/dashboard/process/process-dashbord';
import DashBoardToolBar from 'app/shared/component/statistics/dashboard/dashboard-tool-bar';
import { Helmet } from 'react-helmet';
import { translate } from 'react-jhipster';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  body:{
    background: 'red',
  }
});

export interface IHomeProp extends StateProps, DispatchProps{}

export const Home = (props: IHomeProp) => {

  const classes = useStyles();

  const [userIds, setUserIds] = useState([]);

  const [initialMount, setInitialMount] = useState(true);

  useEffect(() =>{
    if(props.account){
      setUserIds([props.account.id]);
    }
    // document.body.style.background = "#111827"
  }, [])

  const handleChangeUsersIds = (newUserIds) =>{
    setUserIds([...newUserIds]);
    setInitialMount(false);
  }


  return (
      <React.Fragment>
        <Helmet>
          <title>{`${translate("_global.appName")} | Dashboard`}</title>
        </Helmet>
          {(props.isAuthenticated && props.account && props.account.id) ? (<>
            <DashBoardToolBar account={props.account}
              handleChangeUserIds={handleChangeUsersIds}/>
            {(!initialMount || (initialMount && userIds.length !==0)) &&
              <ProcessDashbord userIds={userIds}/> }
          </> ) : (
            <Redirect to="/login" /> 
          )}
    </React.Fragment> 
  );
};

const mapStateToProps = ({ authentication } : IRootState) => ({
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated,
});

const mapDispatchToProps = {
  getUserExtra,
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
