import { faExclamationTriangle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, Modal, Slide, Typography } from "@material-ui/core";
import { Close, HowToReg, Person, TouchApp } from "@material-ui/icons";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { ITab, MyTab } from "app/shared/component/my-tab";
import { ProjectTaskUserRole } from "app/shared/model/enumerations/project-task-user-role.model";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import ProjectTaskUserTab from "./project-task-user-tab";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '45%',
        boxShadow: 'none',
        background: 'transparent',
        marginTop: theme.spacing(15),
    },
    cardheader:{
        padding: theme.spacing(1),
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        // borderBottom: `1px solid ${theme.palette.primary.dark}`,
        borderRadius: '15px 15px 0 0',
    },
    cardContent:{
        background: 'white',
        minHeight: '38vh',
        maxHeight: '80vh',
        overflow: 'auto',
    },
    cardActions:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        paddingTop: 3,
        paddingBottom: 3,
        textAlign: 'center',
        borderRadius: '0 0 15px 15px',
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
}))

interface ITaskUserModalProps{
    task: IProjectTask,
    open: boolean,
    canDelete?: boolean,
    canAdd?: boolean,
    onClose: Function,
}

export const ProjectTaskUserModal = (props: ITaskUserModalProps) =>{
    const [tabs, setTabs] = useState<ITab[]>([]);
   
    const classes = useStyles();
    
    const getTabItem = (value, role: ProjectTaskUserRole, hidden: boolean) =>{
        const tab:ITab = {
            value,
            tabPanelChildren: <ProjectTaskUserTab role={role} task={props.task}
                 canAdd={props.canAdd} canDelete={props.canDelete} hideTitle />,
            tabProps: {
                icon: role === ProjectTaskUserRole.SUBMITOR ? <TouchApp /> : role === ProjectTaskUserRole.VALIDATOR ? <HowToReg /> :  <Person />,
                label: `${translate(`microgatewayApp.ProjectTaskUserRole.${role.toString()}`)}`,
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
            data.push(getTabItem(0,ProjectTaskUserRole.EXCEUTOR,false));
            /* data.push(getTabItem(1,ProjectTaskUserRole.SUBMITOR,false));
            data.push(getTabItem(2,ProjectTaskUserRole.VALIDATOR,false)); */
        }
        setTabs([...data])
    };

    useEffect(() =>{
        getTabs();
    }, [props.task, props.canAdd, props.canDelete])
  
   const handleClose = () =>{
        props.onClose();
   }

   return (
       <React.Fragment>
           <Modal open={props.open} onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
            }}
            disableBackdropClick
            className={classes.modal}>
                <Slide in={props.open}>
                    <Card className={classes.card}>
                        <CardHeader
                            className={classes.cardheader}
                            action={
                                <IconButton onClick={handleClose} color="inherit">
                                    <Close />
                                </IconButton>
                            }
                            avatar={<FontAwesomeIcon icon={faUsers} size="2x" /> }
                            title={
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="h4" className="mr-3">
                                        <span className="text-capitalize">{translate(`microgatewayApp.microprocessTaskUser.home.title`)}</span>
                                    </Typography>
                                </Box>
                            }
                        />
                        <CardContent className={classes.cardContent}>
                        {serviceIsOnline(SetupService.PROJECT) ?
                            <MyTab
                                tabsData={tabs}
                                    defaulValue={0} 
                                    tabsIdPrefix="task-user-tab"
                                    rootBoxProps={{
                                        width:1,
                                        mb:1,
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
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <Box display="flex" justifyContent="center" textAlign="center" width={1}>
                                <Typography variant="caption" 
                                style={{ fontSize: '10px'}}>
                                    {props.task.name}
                                </Typography>
                            </Box>
                        </CardActions>
                    </Card>
                </Slide>
           </Modal>
       </React.Fragment>
   );
}

export default ProjectTaskUserModal;