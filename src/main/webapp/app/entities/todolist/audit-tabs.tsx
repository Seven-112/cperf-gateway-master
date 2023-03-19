import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { ServiceUnavailable } from "app/shared/component/service-unavalaible";
import HorizontalTabLinkWrapper, { TabLinkProps } from "app/shared/component/tab-link";
import ErrorBoundaryRoute from "app/shared/error/error-boundary-route";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { AuditUserRole } from "app/shared/model/enumerations/audit-user-role.model";
import { NotifTag } from "app/shared/model/enumerations/notif-tag-modal";
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";
import { Switch, useHistory } from "react-router-dom";
import UserAudit from "../microrisque/audit/custom/user-audit";
import NotifAutoCleaner from "../notification/custom/notif-auto-cleaner";

const useStyles = makeStyles(theme =>({
    rootBox:{
        boxShadow: 'none',
    },
    
    activeBtn:{
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.primary.main}`
    },
    
}))

const ToExecute = (props) => {
    const classes = useStyles();
    return (
        <>
        <NotifAutoCleaner tags={[NotifTag.AUDIT_STARTED]} />
        <UserAudit
            status={AuditStatus.STARTED} inTodoList
            role={AuditUserRole.EXECUTOR} disableStatusChange 
            hideTitile rootBoxClassName={classes.rootBox} />
        </>
    )
}

const ToSubmit = (props) => {
    const classes = useStyles();
    return (
        <>
        <NotifAutoCleaner tags={[NotifTag.AUDIT_EXECUTED]} />
        <UserAudit 
            status={AuditStatus.EXECUTED} inTodoList
            role={AuditUserRole.SUBMITOR} disableStatusChange 
            hideTitile rootBoxClassName={classes.rootBox} />
        </>
    )
}

const ToValidate = (props) => {
    const classes = useStyles();
    return (
        <>
        <NotifAutoCleaner tags={[NotifTag.AUDIT_SUBMITTED]} />
        <UserAudit status={AuditStatus.SUBMITTED} inTodoList
         role={AuditUserRole.VALIDATOR} disableStatusChange 
         hideTitile rootBoxClassName={classes.rootBox} />
        </>
    )
}

export const AuditTabs = ({match }) =>{
    const classes = useStyles();
    
    const [tabs, setTabs] = useState<TabLinkProps[]>([]);

    const [activePath, setActivePath] = useState(null);

    const history = useHistory();

    const getTabs = () =>{
        const data: TabLinkProps[] = [];
        if(serviceIsOnline(SetupService.AUDIT)){
            data.push({
                label: translate("_global.label.toExecute"),
                value: 'execute',
                className: "text-capitalize",
                notifTags: [NotifTag.AUDIT_STARTED]
            });
           /*  data.push({
                label : translate("_global.label.toSubmit"),
                value: 'submit',
                className: "text-capitalize",
                notifTags: [NotifTag.AUDIT_EXECUTED],
            });
            data.push({
                 label: translate("_global.label.toValidate"),
                 value: 'validate',
                 className: "text-capitalize",
                 notifTags: [NotifTag.AUDIT_SUBMITTED]
            }); */
        }
        setTabs([...data])
    }; 

    useEffect(() =>{
        getTabs();
    }, [])

    const handleClick = (value) =>{
        setActivePath(value);
        history.push(`${match.url}/${value}`);
    }

    return (
        <React.Fragment>
            {serviceIsOnline(SetupService.AUDIT) ?
                    <>
                    <HorizontalTabLinkWrapper 
                        linkBtns={...tabs}
                        activePath={activePath}
                        activeClassName={classes.activeBtn}
                        onLinkClick={handleClick}
                    />
                    <Switch>
                        <ErrorBoundaryRoute path={`${match.url}/execute`} component={ToExecute} />
                        {/* <ErrorBoundaryRoute path={`${match.url}/submit`} component={ToSubmit} />
                        <ErrorBoundaryRoute path={`${match.url}/validate`} component={ToValidate} /> */}
                        <ErrorBoundaryRoute exact path={`${match.url}`} component={ToExecute} />
                    </Switch>
                    </>
                : <>
                    <ServiceUnavailable />
                </>
            }
        </React.Fragment>
    )
}

export default AuditTabs;