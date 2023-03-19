import { Badge, Box, IconButton, makeStyles } from "@material-ui/core";
import { Description, OpenWith, Receipt } from "@material-ui/icons";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { TaskFileType } from "app/shared/model/enumerations/task-file-type.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import React, { useState } from "react";
import { translate } from "react-jhipster";
import TaskUserModal from "../../task-user/custom/task-user-modal";
import TaskFileModal from "../../taskfile/custom/task-file-modal";
import StartupTasksModal from "./startup-tasks-modal";
import TaskRiskEditorModal from "./task-risk-editor-modal";
import { useEffect } from "react";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import TaskItem from "../../task-item/custom/task-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont, faPen, faTasks, faUsers } from "@fortawesome/free-solid-svg-icons";
import TaskUpdate from "./task-update";
import { IProcess } from "app/shared/model/microprocess/process.model";
import theme from "app/theme";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";

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

interface ITaskDetailToolBar{
    task: ITask,
    tProcess: IProcess,
    account:any,
    executor: boolean,
    submitor: boolean,
    validor: boolean,
    taskInInStance?: boolean,
    withUpdateBtn?: boolean,
    onTaskUpdate?:Function,
    onCheckListChane?: Function
}

export const TaskDetailToolbar = (props: ITaskDetailToolBar) =>{
    const { account, tProcess } = props;
    const [descriptionsFilesSize, setDescriptionFilesSize] = useState(0);
    const [openDescFilesModal, setOpenDescFilesModal] = useState(false);
    const [startupTasksSize, setStartupTasksSize] = useState(0);
    const [openUserModal, setOpenUserModal] = useState(false);
    const [openStartupTasksModal, setOpenStartupTasksModal] = useState(false);
    const [validationControlSize, setValidatioControlSize] = useState(0);
    const [openRiskModal, setOpenRiskModal] = useState(false);
    const [task, setTask] = useState<ITask>(props.task);
    const [openCheckList, setOpenCheckList] = useState(false);
    const [openToEdit, setOpenToEdit] = useState(false);
    const [openDescription,setOpenDescription] = useState(false);

    const userCanEdit = account && hasPrivileges({entities: ["Process, Task"], actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]}, account.authorities);
    const userCanDelete = hasPrivileges({entities: ["Process, Task"], actions: [PrivilegeAction.DELETE]},account.authorities);

    useEffect(() =>{
        setTask(props.task);
    }, [props.task])

    const handleOpenDescriptionFilesModal = () =>{
       setOpenDescFilesModal(true);
    }

    const handleCloseDescFileModal = (size) =>{
      setDescriptionFilesSize(size);
      setOpenDescFilesModal(false);
    }
  
    const handleOpenUserModal = () =>{
      setOpenUserModal(true);
    }

    const handleCloseUserModal = () =>{
      setOpenUserModal(false);
    }

    const handleOpenStatupTasksModal = () => setOpenStartupTasksModal(true);
  
    const handleCloseStartupTasksModal = (size: number) => {
      setStartupTasksSize(size);
      setOpenStartupTasksModal(false);
    }
    
    const handleOpenRiskModal = () => setOpenRiskModal(true);

    const handleCloseRiskModal = (updated?:ITask) =>{
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

    const onUpdate = (updated?: ITask, isNew?: boolean) =>{
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
            {/* task update modal */}
            {/* modal cheick list */}
            {/* taks description displayer modal */}
            {task && task.id && 
                <>
                    {userCanEdit && 
                        <TaskUpdate
                            open={openToEdit}
                            task={task}
                            tProcess={tProcess}
                            onClose={() => setOpenToEdit(false)}
                            onSave={onUpdate}
                        />
                    }
                    <TaskItem open={openCheckList} task={task}
                    onCheckChange={handleChekListChange}
                    onClose={() => setOpenCheckList(false)}/>
                    {task.description && <MyCustomPureHtmlRenderModal 
                         open={openDescription}
                         title={translate(`microgatewayApp.microprocessTask.description`)}
                         body={task.description}
                         onClose={() => setOpenDescription(false)}
                    />}
                </>
            }
            {/* ------- modal to display task descriptions files */}
            {task && task.id && openDescFilesModal && <TaskFileModal task={task} 
                open={openDescFilesModal}  type={TaskFileType.DESCRIPTION} canAdd = {userCanEdit}
                canDelete = {userCanEdit} onClose={handleCloseDescFileModal}/>}

            {/* ------- modal to display task users(executor, validator or submitor) */}
            {task && task.id && <TaskUserModal 
                task={task} open={openUserModal} 
                canAdd={userCanEdit} canDelete={userCanEdit} onClose={handleCloseUserModal} />}
                
            {/* ------- modal to display task startupTask */}
            {task && openStartupTasksModal && <StartupTasksModal 
                task={task} open={openStartupTasksModal} canEdit={userCanEdit} onClose={handleCloseStartupTasksModal} />
            }
            
            {/* ------- modal to display tsk risk Controls */}
            {(task && serviceIsOnline(SetupService.RISK)) && 
                <TaskRiskEditorModal task={task} open={openRiskModal} onClose={handleCloseRiskModal} />}

            <Box display="flex" justifyContent="center" p={0} paddingLeft={1} paddingRight={1}>
                {props.withUpdateBtn && userCanEdit &&
                    <IconButton title={translate(`entity.action.edit`)}
                     onClick={() => setOpenToEdit(true)} className={classes.toolbarBtn}>
                        <FontAwesomeIcon icon={faPen} className={classes.toolbarBtnBadgeICon} />
                    </IconButton>
                }
                {task && task.description && 
                    <IconButton title={translate(`microgatewayApp.microprocessTask.description`)}
                    onClick={() => setOpenDescription(true)} className={classes.toolbarBtn}>
                        <FontAwesomeIcon icon={faFont} className={classes.toolbarBtnBadgeICon} />
                    </IconButton>
                }
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
                        <FontAwesomeIcon icon={faUsers} className={classes.toolbarBtnBadgeICon} />
                    </IconButton>

                    {/* ------- Button to display task startuptasks */ }
                    <IconButton title={translate(`_global.label.startupTasks`)} 
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

                    {/* ------- Button to display task checkList modal */ }
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

export default TaskDetailToolbar;