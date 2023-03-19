import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import HorizontalTabLinkWrapper, { TabLinkProps } from "app/shared/component/tab-link";
import ErrorBoundaryRoute from "app/shared/error/error-boundary-route";
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";
import { Switch, useHistory } from "react-router-dom";
import QueryInstanceTovalidate from "../qmanager/query/custom/query-insatnce-to-validate";
import UserQuery from "../qmanager/query/custom/user-query";
import { NotifTag } from "app/shared/model/enumerations/notif-tag-modal";
import { ServiceUnavailable } from "app/shared/component/service-unavalaible";

const useStyles = makeStyles(theme =>({
    activeBtn:{
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.primary.main}`
    }
    
}))

const TabUserQuery = (props) =>( <UserQuery />)

const TabQueryToValidate = (props) => (<QueryInstanceTovalidate />)

export const QueryTabs = ({ match }) =>{
    const classes = useStyles();
    
    const [activePath, setActivePath] = useState(null);

    const history = useHistory();

    const links: TabLinkProps[] = [
        {
            label:translate("_global.label.myQueries"), 
            value: 'forMe',
            className: 'text-capitalize',
            notifTags: [NotifTag.Q_CREATED, NotifTag.Q_INSANCE_CREATED,
                        NotifTag.Q_INSTANCE_REJECTED, NotifTag.Q_INSTANCE_VALIDATED]
        },
        {
            label: translate("_global.label.toValidate"), 
            value: 'toValidate',
            className: 'text-capitalize',
            notifTags: [NotifTag.Q_INSTANCE_TO_POST_VALIDATE, NotifTag.Q_INSTANCE_TO_VALIDE]
        }
    ];

    const handleClick = (value) =>{
        setActivePath(value);
        history.push(`${match.url}/${value}`);
    }

    return (
        <React.Fragment>
            {serviceIsOnline(SetupService.QMANAGER) ?
                <>
                <HorizontalTabLinkWrapper 
                    linkBtns={...links}
                    activePath={activePath}
                    activeClassName={classes.activeBtn}
                    onLinkClick={handleClick}
                 />
                 <Switch>
                     <ErrorBoundaryRoute path={`${match.url}/forMe`} component={TabUserQuery} />
                     <ErrorBoundaryRoute path={`${match.url}/toValidate`} component={TabQueryToValidate} />
                     <ErrorBoundaryRoute exact path={match.url} component={TabUserQuery} />
                 </Switch>
                </>
                :
                <>
                    <ServiceUnavailable />
                </> 
            }
        </React.Fragment>
    )
}

export default QueryTabs;