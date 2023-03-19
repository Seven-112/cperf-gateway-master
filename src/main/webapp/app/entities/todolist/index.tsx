import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';

import ErrorBoundaryRoute from "app/shared/error/error-boundary-route";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { translate } from "react-jhipster";
import HorizontalTabLinkWrapper, { TabLinkProps } from "app/shared/component/tab-link";
import QueryTabs from "./query-tabs";
import ProcessTabs from "./process-tabs";
import ProjectTabs from "./project-tabs";
import AuditTabs from "./audit-tabs";
import AuditRecommendationTabs from "./audit-recommendation-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { NotifTag } from "app/shared/model/enumerations/notif-tag-modal";
import TodoUserFinderButton from "../user-extra/custom/todo-user-finder-btn";
import { ServiceUnavailable } from "app/shared/component/service-unavalaible";

const useStyles = makeStyles(theme =>({
    tabAppBar:{
        boxShadow: 'none',
    },
    tabIndicator:{
        color: theme.palette.primary.dark,
        background: theme.palette.primary.dark,
    },
    tab:{
    },
    selectedTab:{
        background: theme.palette.primary.dark,
        color: 'white',
    }
    
}))


const Routes = ({ match }) => {

    const [tabs, setTabs] = useState<TabLinkProps[]>([]);

    const classes = useStyles();

    const [activePath, setActivePath] = useState(null);

    const history = useHistory();

    const enum LINK_PREFIX {
        processPath = "process",
        projectPath = "projects",
        queryPath = "queries",
        auditPath = "audits",
        recommandationPath = "recommandations"
    }

    const loadTabLinks = () =>{
        const items: TabLinkProps[] = [];
        if(serviceIsOnline(SetupService.PROCESS)){
            items.push({
                label:translate("microgatewayApp.microprocessProcess.home.title"), 
                value: LINK_PREFIX.processPath,
                notifTags: [
                    NotifTag.TASK_STARTED, NotifTag.TASK_EXECUTED,
                    NotifTag.TASK_SUBMITTED,NotifTag.TASK_ITEM_TO_CHECK,
                    NotifTag.TASK_CANCELED, NotifTag.TASK_COMPLETED,
                    NotifTag.TASK_LOG_CREATED,NotifTag.TASK_LOG_UPDATED
                ]
            });
        }
        if(serviceIsOnline(SetupService.PROJECT)){
            items.push({
                label:translate("microgatewayApp.microprojectProject.home.title"), 
                value: LINK_PREFIX.projectPath,
                notifTags:[
                    NotifTag.PRJ_TASK_STARTED,NotifTag.PRJ_TASK_EXECUTED,
                    NotifTag.PRJ_TASK_SUBMITTED,NotifTag.PRJ_TASK_ITEM_TO_CHECK, 
                    NotifTag.PRJ_TASK_CANCELED,NotifTag.PRJ_TASK_COMPLETED,
                    NotifTag.PRJ_TASK_LOG_UPDATED,NotifTag.PRJ_TASK_LOG_CREATED
                ]
            });
        }
        if(serviceIsOnline(SetupService.QMANAGER)){
            items.push({
                label: translate("microgatewayApp.qmanagerQuery.home.title"), 
                value: LINK_PREFIX.queryPath,
                notifTags: [
                    NotifTag.Q_CREATED, NotifTag.Q_INSANCE_CREATED,
                    NotifTag.Q_INSTANCE_REJECTED, NotifTag.Q_INSTANCE_VALIDATED,
                    NotifTag.Q_INSTANCE_TO_POST_VALIDATE, NotifTag.Q_INSTANCE_TO_VALIDE
                ],
            });
        }
        if(serviceIsOnline(SetupService.AUDIT)){
            items.push({
                label: translate("microgatewayApp.microrisqueAudit.home.title"), 
                value: LINK_PREFIX.auditPath,
                notifTags: [
                    NotifTag.AUDIT_STARTED,
                    NotifTag.AUDIT_EXECUTED,NotifTag.AUDIT_SUBMITTED
                ],
            });
            items.push({
                label: translate("microgatewayApp.microrisqueAuditRecommendation.home.title"), 
                value: LINK_PREFIX.recommandationPath,
                notifTags: [
                    NotifTag.RECOM_STARTED,
                    NotifTag.RECOM_EXECUTED,NotifTag.RECOM_SUBMITTED
                ]
            });
        }
        setTabs([...items]);

    }

    const getRedirectUri = (baseUri) =>{
        if(serviceIsOnline(SetupService.PROCESS))
            return `${baseUri}/${LINK_PREFIX.processPath}/execute`;
        else if(serviceIsOnline(SetupService.PROJECT))
            return `${baseUri}/${LINK_PREFIX.projectPath}/execute`;
        else if(serviceIsOnline(SetupService.QMANAGER))
            return `${baseUri}/${LINK_PREFIX.queryPath}/forMe`;
        else if(serviceIsOnline(SetupService.AUDIT))
            return `${baseUri}/${LINK_PREFIX.auditPath}/execute`;
        else
            return '/';
    }
    
    useEffect(() =>{
        loadTabLinks();
    }, [])

    const handleClick = (value) =>{
        setActivePath(value);
        if(value && value.toString() !== LINK_PREFIX.queryPath.toString())
            history.push(`${match.url}/${value}/execute`);
        else
            history.push(`${match.url}/${value}/forMe`);
    }

    return (
        <Box width={1}>
            <HorizontalTabLinkWrapper 
                linkBtns={...tabs}
                activePath={activePath}
                onLinkClick={handleClick}
                action={<TodoUserFinderButton />}
             />
            {<Switch>
                <ErrorBoundaryRoute path={`${match.url}/${LINK_PREFIX.processPath}`} component={ProcessTabs} />
                <ErrorBoundaryRoute path={`${match.url}/${LINK_PREFIX.projectPath}`} component={ProjectTabs} />
                <ErrorBoundaryRoute path={`${match.url}/${LINK_PREFIX.queryPath}`} component={QueryTabs} />
                <ErrorBoundaryRoute path={`${match.url}/${LINK_PREFIX.auditPath}`} component={AuditTabs} />
                <ErrorBoundaryRoute path={`${match.url}/${LINK_PREFIX.recommandationPath}`} component={AuditRecommendationTabs} />
                <Route exact path={match.url}>
                    {[...tabs].length !== 0 ? (
                        <Redirect to={getRedirectUri(match.url)} />
                    ):(
                        <ServiceUnavailable />
                    )}
                </Route>
            </Switch>}
        </Box>
    );
}

export default Routes;