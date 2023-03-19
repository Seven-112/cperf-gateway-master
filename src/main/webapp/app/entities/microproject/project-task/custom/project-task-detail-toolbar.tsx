import { Badge, Box, IconButton, makeStyles } from "@material-ui/core";
import { Description, OpenWith, Receipt } from "@material-ui/icons";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import React, { useState } from "react";
import { translate } from "react-jhipster";
import { useEffect } from "react";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont, faPen, faTasks, faUsers } from "@fortawesome/free-solid-svg-icons";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import ProjectTaskItem from "../../project-task-item/custom/project-task-item";
import ProjectTaskFileModal from "../../project-task-file/custom/project-task-file-modal";
import { ProjectTaskFileType } from "app/shared/model/enumerations/project-task-file-type.model";
import ProjectTaskUserModal from "../../project-task-user/custom/project-task-user-modal";
import { ProjectTaskUserRole } from "app/shared/model/enumerations/project-task-user-role.model";
import theme from "app/theme";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import ProjectStartableTask from "../../project-startable-task/custom/project-startable-task";
import ProjectTaskUpdate from "./project-task-update";
import { IProject } from "app/shared/model/microproject/project.model";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";

const useStyles = makeStyles({
   toolbarBtn:{
        padding: 0,
        margin: 0,
        marginRight: theme.spacing(3),
   },
   toolbarBtnBadge:{
        fontWeight: 'bold',
        fontSize: 50,
   },
   toolbarBtnBadgeICon:{
        color: theme.palette.background.paper,
   },
})

interface IProjectTaskDetailToolBar{
    task: IProjectTask,
    executor: boolean,
    submitor: boolean,
    validor: boolean,
    withUpdateBtn?: boolean,
    taskInStance?: boolean,
    onTaskUpdate?:Function,
    onCheckListChane?: Function
}

export const ProjectTaskDetailToolbar = (props: IProjectTaskDetailToolBar) =>{

    const [descriptionsFilesSize, setDescriptionFilesSize] = useState(0);
    const [openDescFilesModal, setOpenDescFilesModal] = useState(false);
    const [execurorsSize, setExecutorsSize] = useState(0);
    const [submitorsSize, setSubmitorsSize] = useState(0);
    const [validatorsSize, setValidatorsSize] = useState(0);
    const [startupTasksSize, setStartupTasksSize] = useState(0);
    const [openUserModal, setOpenUserModal] = useState(false);
    const [modalUserRole, setModalUserRole] = useState(ProjectTaskUserRole.EXCEUTOR);
    const [openStartupTasksModal, setOpenStartupTasksModal] = useState(false);
    const [validationControlSize, setValidatioControlSize] = useState(0);
    const [openRiskModal, setOpenRiskModal] = useState(false);
    const [task, setTask] = useState<IProjectTask>(props.task);
    const [openCheckList, setOpenCheckList] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);
    const [openToEdit, setOpenToEdit] = useState(false);
    const [project, setProject] = useState<IProject>(null);

    const userCanEdit = hasPrivileges({entities: ["Process, Task"], actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]});
    const userCanDelete = hasPrivileges({entities: ["Process, Task"], actions: [PrivilegeAction.DELETE]});

    const getProject = () =>{
        if(props.task && props.task.processId){
            axios.get<IProject>(`${API_URIS.projectApiUri}/${props.task.processId}`)
                .then(res => setProject(res.data))
                .catch(e => console.log(e))
        }
    }

    useEffect(() =>{
        setTask(props.task);
        getProject();
    }, [props.task])

    const handleOpenDescriptionFilesModal = () =>{
       setOpenDescFilesModal(true);
    }

    const handleCloseDescFileModal = (size) =>{
      setDescriptionFilesSize(size);
      setOpenDescFilesModal(false);
    }
  
    const handleOpenUserModal = () =>setOpenUserModal(true);

    const handleCloseUserModal = (size) =>{
      if(modalUserRole === ProjectTaskUserRole.SUBMITOR)
          setSubmitorsSize(size)
      else if(modalUserRole === ProjectTaskUserRole.VALIDATOR)
          setValidatorsSize(size);
      else
          setExecutorsSize(size);
      setOpenUserModal(false);
    }

    const handleOpenStatupTasksModal = () => setOpenStartupTasksModal(true);
  
    const handleCloseStartupTasksModal = (size: number) => {
      setStartupTasksSize(size);
      setOpenStartupTasksModal(false);
    }
    
    const handleOpenRiskModal = () => setOpenRiskModal(true);

    const handleCloseRiskModal = (updated?:IProjectTask) =>{
        setOpenRiskModal(false);
        if(updated){
            if(props.onTaskUpdate)
                props.onTaskUpdate(updated)
            setTask(updated)
        }
    }

    const handleChekListChange = () =>{
        if(props.onCheckListChane)
            props.onCheckListChane();
    }

    const onUpdate = (updated?: IProjectTask, isNew?: boolean) =>{
        if(updated){
            if(!isNew)
                setTask(updated);
            if(props.onTaskUpdate)
                props.onTaskUpdate(updated, isNew);
            setOpenToEdit(false);
        }
    }

    const classes = useStyles();

    return (
        <React.Fragment>
            {task && task.description &&
             <MyCustomPureHtmlRenderModal 
                open={openDesc}
                title={translate('microgatewayApp.microprocessTask.description')}
                body={task.description}
                onClose={() => setOpenDesc(false)}
            />}
            {/* modal cheick list and update task modal */}
            {task && task.id && <>
                <ProjectTaskItem open={openCheckList} task={task}
                 onCheckChange={handleChekListChange}
                 onClose={() => setOpenCheckList(false)}/>
                {userCanEdit && 
                    <ProjectTaskUpdate
                        open={openToEdit}
                        task={task}
                        project={project}
                        onClose={() => setOpenToEdit(false)}
                        onSave={onUpdate}
                    />
                }
            </>}
            {/* ------- modal to display task descriptions files */}
            {task && task.id && openDescFilesModal && <ProjectTaskFileModal task={task} 
                open={openDescFilesModal} type={ProjectTaskFileType.DESCRIPTION} canAdd = {userCanEdit}
                canDelete = {userCanEdit} onClose={handleCloseDescFileModal}/>}

            {/* ------- modal to display task users(executor, validator or submitor) */}
            {task && task.id && <ProjectTaskUserModal 
                 task={task} open={openUserModal} canAdd={userCanEdit}
                 canDelete={userCanEdit} onClose={handleCloseUserModal} />}

            {/* ---- modal to display startable tasks */}
            {task && <ProjectStartableTask open={openStartupTasksModal} 
                task={task} onClose={() => setOpenStartupTasksModal(false)} />}
            
            {/* ------- modal to display tsk risk Controls 
            {(task && serviceIsOnline(SetupService.RISK)) && <ProjectTaskRiskEditorModal task={task} open={openRiskModal} onClose={handleCloseRiskModal} />
            */}

            <Box display="flex" justifyContent="center" p={0} paddingLeft={1} paddingRight={1}>
                {/* --- Button to display update modal --- */}
                {props.withUpdateBtn && userCanEdit &&
                    <IconButton title={translate(`entity.action.edit`)}
                     onClick={() => setOpenToEdit(true)} className={classes.toolbarBtn}>
                        <FontAwesomeIcon icon={faPen} className={classes.toolbarBtnBadgeICon} />
                    </IconButton>
                }
                {/* --- Button to display description text */}
                <IconButton title={translate(`microgatewayApp.microprocessTask.description`)}
                    onClick={() => setOpenDesc(true)} className={classes.toolbarBtn}>
                    <FontAwesomeIcon icon={faFont} className={classes.toolbarBtnBadgeICon} />
                </IconButton>
                {/* ------- Button to display task descriptions files */}
                <IconButton title={translate("_global.task.descriptionFiles")}
                    onClick={handleOpenDescriptionFilesModal} className={classes.toolbarBtn}>
                    <Badge badgeContent={descriptionsFilesSize} color="secondary"
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom', }}
                        className={classes.toolbarBtnBadge}
                    >
                    <Description className={classes.toolbarBtnBadgeICon} />
                    </Badge>
                </IconButton>
                { /* ------- Button to display task users */}
                {userCanEdit && <React.Fragment>
                    {/* ------- Button to display task users executors */ }
                    <IconButton title={translate(`microgatewayApp.microprocessTaskUser.home.title`)}
                     onClick={handleOpenUserModal} className={classes.toolbarBtn}>
                        <FontAwesomeIcon icon={faUsers} size="1x" className={classes.toolbarBtnBadgeICon} />
                    </IconButton>

                    {/* ------- Button to display task users sumitors }
                    {serviceIsOnline(SetupService.RISK) && 
                        <IconButton title={translate(`microgatewayApp.TaskUserRole.${TaskUserRole.SUBMITOR.toString()}`) + 'S'}
                        onClick={() =>handleOpenUserModal(ProjectTaskUserRole.SUBMITOR)} className={classes.toolbarBtn}>
                        <Badge badgeContent={submitorsSize}  color="secondary"
                            anchorOrigin={{ horizontal: 'right',vertical: 'bottom'}}
                            className={classes.toolbarBtnBadge}>
                            <TouchApp className={classes.toolbarBtnBadgeICon} />
                        </Badge>
                        </IconButton>
                    }

                    {serviceIsOnline(SetupService.RISK) && 
                        <IconButton title={translate(`microgatewayApp.TaskUserRole.${TaskUserRole.VALIDATOR.toString()}`) + 'S'}
                            onClick={() =>handleOpenUserModal(ProjectTaskUserRole.VALIDATOR)} className={classes.toolbarBtn}>
                            <Badge badgeContent={validatorsSize}  color="secondary"
                                anchorOrigin={{ horizontal: 'right',vertical: 'bottom'}}
                                className={classes.toolbarBtnBadge}>
                                <HowToReg className={classes.toolbarBtnBadgeICon} />
                            </Badge>
                        </IconButton>
                    }

                    { ------- Button to display task startuptasks */ }
                    <IconButton title={translate(`_global.label.taskDepends`)} 
                        className={classes.toolbarBtn} onClick={handleOpenStatupTasksModal}>
                        <Badge badgeContent={startupTasksSize}  color="secondary"
                            anchorOrigin={{ horizontal: 'right',vertical: 'bottom'}}
                            className={classes.toolbarBtnBadge}>
                            <OpenWith className={classes.toolbarBtnBadgeICon} />
                        </Badge>
                    </IconButton>

                    {/* ------- Button to display task validation control modal */ }
                    {serviceIsOnline(SetupService.RISK) && 
                        <IconButton title={translate(`microgatewayApp.microrisqueRisk.detail.title`)} 
                            className={classes.toolbarBtn} onClick={handleOpenRiskModal}>
                            <Badge badgeContent={validationControlSize}  color="secondary"
                                anchorOrigin={{ horizontal: 'right',vertical: 'bottom'}}
                                className={classes.toolbarBtnBadge}>
                                <Receipt className={classes.toolbarBtnBadgeICon} /> 
                            </Badge>
                        </IconButton>
                    }

                    {/* ------- Button to display task checkList modal -- */}
                    <IconButton title={translate(`microgatewayApp.microprocessTaskItem.home.title`)} 
                        className={classes.toolbarBtn} onClick={() => setOpenCheckList(true)}>
                            <FontAwesomeIcon icon={faTasks} size="sm" className={classes.toolbarBtnBadgeICon}/>
                    </IconButton>
                </React.Fragment>
                }
            </Box>
        </React.Fragment>
    );
}

ProjectTaskDetailToolbar.defaultProps = {
    withUpdateBtn: true
}

export default ProjectTaskDetailToolbar;