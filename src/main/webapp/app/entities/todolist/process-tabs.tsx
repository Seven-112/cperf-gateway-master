import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import HorizontalTabLinkWrapper, { TabLinkProps } from "app/shared/component/tab-link";
import ErrorBoundaryRoute from "app/shared/error/error-boundary-route";
import { NotifTag } from "app/shared/model/enumerations/notif-tag-modal";
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";
import { TaskUserRole } from "app/shared/model/enumerations/task-user-role.model";
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";
import { Switch, useHistory } from "react-router-dom";
import UserTask from "../microprocess/task/custom/user-task";
import UserChecklistTask from "../microprocess/task/custom/user-checklist-task";
import NotifAutoCleaner from "../notification/custom/notif-auto-cleaner";
import { ServiceUnavailable } from "app/shared/component/service-unavalaible";

const useStyles = makeStyles(theme =>({
    activeBtn:{
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.primary.main}`
    }
    
}))

const ToExecute = (props) => (
    <>
    <NotifAutoCleaner tags={[NotifTag.TASK_STARTED]} />
    <UserTask status={TaskStatus.STARTED} inTodoList
        role={TaskUserRole.EXCEUTOR} disableStatusChange hideTitile />
    </>
);

const ToSubmit = (props) => (
    <>
    <NotifAutoCleaner tags={[NotifTag.TASK_EXECUTED]} />
    <UserTask status={TaskStatus.EXECUTED} inTodoList
        role={TaskUserRole.SUBMITOR} disableStatusChange hideTitile />
    </>
)

const ToValidate = (props) => (
    <>
        <NotifAutoCleaner tags={[NotifTag.TASK_SUBMITTED]} />
        <UserTask 
            status={TaskStatus.SUBMITTED}
            inTodoList
            role={TaskUserRole.VALIDATOR}
             disableStatusChange hideTitile
         />
    </>
)

const CheckList = (props) => ( 
    <>
        <NotifAutoCleaner tags={[NotifTag.TASK_ITEM_TO_CHECK, 
            NotifTag.TASK_ITEM_CHECKED, NotifTag.TASK_ITEM_UNCHECKED]} />
        <UserChecklistTask inTodoList />
    </>
)

const AllUserTasks = (props) => (
    <>
        <NotifAutoCleaner tags={
            [NotifTag.TASK_CANCELED, NotifTag.TASK_COMPLETED,
                NotifTag.TASK_LOG_CREATED,NotifTag.TASK_LOG_UPDATED]} />
        <UserTask inTodoList />
    </>
 )

export const ProcessTabs = ({ match }) =>{
    const classes = useStyles();
    const [tabs, setTabs] = useState<TabLinkProps[]>([]);

    const [activePath, setActivePath] = useState(null);

    const history = useHistory();

    const getTabs = () =>{
        const data: TabLinkProps[] = [];
        if(serviceIsOnline(SetupService.PROCESS)){
           data.push({
               label: translate("_global.label.toExecute"),
               value: 'execute',
               className: "text-capitalize",
               notifTags: [NotifTag.TASK_STARTED, NotifTag.TASK_ON_PAUSE]
           });
           /* data.push({
               label : translate("_global.label.toSubmit"),
               value: 'submit',
               className: "text-capitalize",
               notifTags: [NotifTag.TASK_EXECUTED]
           });
           data.push({
                label: translate("_global.label.toValidate"),
                value: 'validate',
                className: "text-capitalize",
                notifTags: [NotifTag.TASK_SUBMITTED]
           }); */
            data.push({
               label: translate("_global.label.checkList"),
               value: 'checkList',
               className: "text-capitalize",
               notifTags: [NotifTag.TASK_ITEM_TO_CHECK]
            });
            data.push({
                label: translate("_global.label.yourTasks"),
                value: 'yourTasks',
                className: "text-capitalize",
                notifTags: [NotifTag.TASK_CANCELED, NotifTag.TASK_COMPLETED,
                            NotifTag.TASK_LOG_CREATED,NotifTag.TASK_LOG_UPDATED]
            });

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
            {serviceIsOnline(SetupService.PROCESS) ?
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
                        <ErrorBoundaryRoute path={`${match.url}/checkList`} component={CheckList} /> 
                        <ErrorBoundaryRoute path={`${match.url}/yourTasks`} component={AllUserTasks} />
                        <ErrorBoundaryRoute exact path={`${match.url}`} component={ToExecute} />
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

export default ProcessTabs;