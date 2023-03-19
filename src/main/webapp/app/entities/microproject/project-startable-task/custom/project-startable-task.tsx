import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { hasPrivileges } from "app/shared/auth/helper";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { ITab, MyTab } from "app/shared/component/my-tab";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { IProjectTask } from "app/shared/model/microproject/project-task.model"
import { IRootState } from "app/shared/reducers";
import { getSession } from "app/shared/reducers/authentication";
import theme from "app/theme";
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import ProjectStartupTasksTab from "../../project-task/custom/project-startup-tasks-tab";
import ProjectTaskLoopBackStartableTab from "./project-task-loop-back-startable-tab";
import ProjectTaskStartableAfterValidatedTaskTab from "./project-task-startable-after-validated-task-tab";

const useStyles = makeStyles({
    modalCard:{
    },
    tabAppBar:{
        boxShadow: 'none',
    },
    tabIndicator:{
        color: theme.palette.primary.dark,
        background: theme.palette.primary.dark,
    },
    tab:{
        /* borderRadius:'15px 15px 0 0',
        border: `1px solid ${theme.palette.primary.dark}`,
        borderBottom: 'none',
        borderLeft: 'none', */
        textTransform: 'none',
    },
    selectedTab:{
        // background: theme.palette.primary.main,
        color: theme.palette.primary.dark,
    }
})

interface ProjectStartableTaskProps extends StateProps, DispatchProps{
    task: IProjectTask,
    open?: boolean,
    onClose: Function,
}

export const ProjectStartableTask = (props: ProjectStartableTaskProps) =>{
    const { task, open } = props;

    const [tabs, setTabs] = useState<ITab[]>([]);
   
    const classes = useStyles();

    const canEdit = props.account && hasPrivileges({ 
            entities: ['Project', 'ProjectTask'], 
            actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.UPDATE] },
            props.account.authorities
        )
    
    const getTabItem = (value,label, children: any, hidden: boolean) =>{
        const tab:ITab = {
            value,
            tabPanelChildren: children,
            tabProps: {
                // icon: <></>,
                label,
                classes:{
                    root: `${classes.tab}`,
                    selected: classes.selectedTab,
                },
            },
            hidden
            
        }
        return tab;
    }
    
    const getTabs = () =>{
       const data: ITab[] = [];
        if(serviceIsOnline(SetupService.PROJECT)){
            data.push(getTabItem(0,translate(`_global.label.startupTasks`),
                <ProjectStartupTasksTab task={task} canEdit={canEdit} />, false));
            data.push(getTabItem(1, translate(`_global.label.loopbackTasks`),
                <ProjectTaskLoopBackStartableTab task={task} account={props.account} canEdit={canEdit} />,false));
            data.push(getTabItem(2, translate(`_global.label.startableValidationTasks`),
                <ProjectTaskStartableAfterValidatedTaskTab task={task} account={props.account} canEdit={canEdit}/>,false));
        }
        setTabs([...data])
    };

    useEffect(() =>{
        if(!props.account)
            props.getSession();
    }, [])

    useEffect(() =>{
        getTabs();
    }, [props.task])

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <MyCustomModal open={open}
             title={translate(`_global.label.taskDepends`)}
             rootCardClassName={classes.modalCard}
             footer={<Box width={1} display="flex" justifyContent={"center"} alignItems="center"
             flexWrap={"wrap"}>
                 {task && <Typography>
                     {`${translate(`microgatewayApp.microprocessTask.detail.title`)} : ${task.name}`}
                 </Typography> }
             </Box>}
             onClose={handleClose}>
                {serviceIsOnline(SetupService.PROJECT) ?
                    <MyTab
                        tabsData={tabs}
                            defaulValue={0} 
                            tabsIdPrefix="task-user-tab"
                            rootBoxProps={{
                                width:1,
                            }}
                            appBarProps={{
                                position: 'static',
                                color: 'inherit',
                                className: classes.tabAppBar,
                            }}
                            tabsProps={{
                                indicatorColor: 'primary',
                                textColor: 'inherit',
                                variant: 'standard',
                                "aria-label": 'task users tabs panels'
                            }}
                            tabPanelRootBoxProps={{
                                width:1,
                                display:"flex",
                                flexWrap:"wrap",
                                justifyContent:"center",
                            }}
                    />
                    :
                    <Box width={1} display="flex" justifyContent="center" flexWrap="wrap"
                        alignItems="flex-end" mt={5} mb={5}>
                        <FontAwesomeIcon  icon={faExclamationTriangle} size="3x" className="text-warning"/>
                        <Typography variant="h3" className="ml-3 mr-3 text-warning">
                            {translate("_global.label.nnavailableService")+' !'}
                        </Typography>
                    </Box> 
                }
            </MyCustomModal>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    account: authentication.account,
  });
  
  const mapDispatchToProps = {
    getSession,
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProjectStartableTask);