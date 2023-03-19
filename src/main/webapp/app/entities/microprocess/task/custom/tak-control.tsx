import { Box, BoxProps, CircularProgress, IconButton, IconButtonProps, makeStyles, Tooltip, TooltipProps } from "@material-ui/core";
import { ITask } from "app/shared/model/microprocess/task.model";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ITaskUser } from "app/shared/model/microprocess/task-user.model";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { TaskUserRole } from "app/shared/model/enumerations/task-user-role.model";
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { faArrowsAlt, faBan, faCheckCircle, faHistory, faPaperPlane, faPause, faPlay, faRedoAlt, faShieldAlt, faStepBackward, faSync, faTrash, faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import { cleanEntity } from "app/shared/util/entity-utils";
import { translate } from "react-jhipster";
import { IProcess } from "app/shared/model/microprocess/process.model";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction, PrivilegeEntity } from "app/shared/model/enumerations/privilege-action.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import TaskStatusTrakingUpdate from "../../task-status-traking/custom/task-status-traking-update";
import { ITaskStatusTraking } from "app/shared/model/microprocess/task-status-traking.model";
import { TaskStatusTrakingModal } from "../../task-status-traking/custom/task-status-traking";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import TaskWidgetChooser from "./task-wdget-chooser";
import { ProcessTasksLogsModal } from "../../process/custom/process-tasks-logs";

const useStyles = makeStyles(theme =>({

}))

interface TaskControlProps extends StateProps, DispatchProps{
    task: ITask,
    realod?:boolean,
    rootBoxProps?: BoxProps,
    iconProps?: FontAwesomeIconProps,
    iconButtonProps?: IconButtonProps,
    toolTipProps?: TooltipProps,
    onUpdate?: Function,
    withPlayOrPauseBtn?: boolean,
    withManualModalRestBtn?:boolean,
    inTodoList?:boolean,
    checkingOnly?: boolean,
    onDelete?:Function,
}

export const TaskControl = (props: TaskControlProps) =>{
    const { rootBoxProps, account, iconProps, iconButtonProps, toolTipProps, withManualModalRestBtn,withPlayOrPauseBtn } = props;
    const [task, setTask] = useState(props.task);
    const [prcess, setProcess] = useState<IProcess>(null)
    const [loading, setLoading] = useState(false);
    const [taskUserRoles, setTaskUsersRole] = useState<ITaskUser[]>([]);
    const [action, setAction] = useState<TaskStatus>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [openTaskTacks, setOpenTaskTracks] = useState(false);
    const [openDeleterModal, setOpenDeleterModal] = useState(false);
    const [taskHasSubmitorOrValidator, setTaskHasValidatorOrSubmotor] = useState(false);
    const [checked, setChecked] = useState(false);
    const [previewTasks, setPreviewTasks] = useState<ITask[]>([]);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [relunchPrevTask, setRelunchPrevTask] = useState(false);
    const [selectedPreviewTask, setSelectedPreviewTask] = useState<ITask>(null);
    const [openTaskChooser, setOpenTaskChooser] = useState(false);
    const [openAllProcessTasksLogs, setOpenAllProcessTasksLogs] = useState(false);

    const classes = useStyles();

    const mergeTaskUserRoles = (roles: ITaskUser[]) =>{
        if(userExtra && userExtra.employee && userExtra.employee.department && userExtra.employee.department.id === task.groupId){
            const tUserRole: ITaskUser = {
                role: (serviceIsOnline(SetupService.RISK) && task.riskId) ? TaskUserRole.SUBMITOR : TaskUserRole.EXCEUTOR,
                task,
                userId: userExtra.id
            }
            setTaskUsersRole([...roles, tUserRole]);
        }else{
            setTaskUsersRole([...roles]);
        }
    }

    const taskIsChecked = () =>{
        if(props.task && props.task.id){
            setLoading(true);
            axios.get<boolean>(`${API_URIS.taskApiUri}/isChecked/${props.task.id}`)
            .then(res => {
                console.log("task checked ", res.data);
                setChecked(res.data);
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
        }
    }

    const getTaskUsers = () =>{
        if(userExtra && task && task.id){
            setLoading(true)
            axios.get<ITaskUser[]>(`${API_URIS.taskUserApiUri}/?taskId.equals=${task.id}&userId.equals=${userExtra.id}`)
                .then(res =>{
                    mergeTaskUserRoles([...res.data]);
                }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
        }
    }
    
    const getUserExtra = () =>{
        if(account && account.id){
            setLoading(true)
            axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/?userId.equals=${account.id}`)
                .then(res =>{
                    if(res.data && res.data.length !== 0){
                        setUserExtra(res.data[0]);
                    }
                }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
        }
    }

    const getProcess = (processId) =>{
        if(processId){
            setLoading(true)
            axios.get<IProcess>(`${API_URIS.processApiUri}/${processId}`)
                .then(res =>{
                    setProcess(res.data)
                }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
        }
    }

    const checkTaskHasSubmitorOrValidator = () =>{
        if(task && task.id){
            const roles = [TaskUserRole.SUBMITOR, TaskUserRole.VALIDATOR];
            axios.get<ITaskUser[]>(`${API_URIS.taskUserApiUri}/?taskId.equals=${task.id}&role.in=${[roles].join(',')}&page=${0}&size=${1}`)
                .then(res =>{
                    if(res.data && res.data.length !== 0)
                        setTaskHasValidatorOrSubmotor(true);
                    else
                        setTaskHasValidatorOrSubmotor(false)
                }).catch(e => console.log(e))
        }else{
            setTaskHasValidatorOrSubmotor(false);
        }
    }

    const getPreviewTask = () =>{
        if(props.task && props.task.id){
            setLoadingPreview(true)
            axios.get<ITask[]>(`${API_URIS.taskApiUri}/${props.task.id}/preview`)
            .then(res => {
                console.log("task_size",res.data.length)
                setPreviewTasks([...res.data])
            })
            .catch(e => console.log(e))
            .finally(() => setLoadingPreview(false))
        }
    }

    useEffect(() =>{
        getUserExtra();
    }, [])

    useEffect(() =>{
        setTask(props.task);
        taskIsChecked();
        if(props.task)
            getProcess(props.task.processId);
        getTaskUsers();
        checkTaskHasSubmitorOrValidator();
        getPreviewTask();
    }, [props.task, props.realod])

    useEffect(() =>{
        getTaskUsers();
    }, [userExtra])

    
    const handleSaveTraking = (saved?: ITaskStatusTraking, isNew?: boolean) =>{
        /* if(saved && !isNew && props.onUpdate)
            props.onUpdate(saved); */
    }

    const handleSave = (saved?: ITask) =>{
        if(saved){
            setTask(saved)
            if(props.onUpdate)
                props.onUpdate(saved);
        }
    }

    const handleCloseConfirm = () =>{
        setOpenConfirm(false);
        setAction(null);
        setRelunchPrevTask(false);
    }


    const handlePlayOrPause = () =>{
        if(task){
            if(task.status === TaskStatus.ON_PAUSE){
                    setLoading(true)
                    const apiUri = `${API_URIS.taskApiUri}/play`;
                    axios.put<ITask>(apiUri, cleanEntity(task)).then(res =>{
                        if(res.data){
                            setTask(res.data);
                            if(props.onUpdate)
                                props.onUpdate(res.data)
                        }
                    }).catch(e =>{
                        /* eslint-disable no-console */
                        console.log(e);
                    }).finally(() => setLoading(false))
            }else{
                setAction(TaskStatus.ON_PAUSE);
                setOpenConfirm(true)
            }
        }
    }

    const handleDisableManualMode = () =>{
        if(task){
            const entity: ITask = {
                ...task, 
                manualMode: false,
            }
            setLoading(true)
            axios.put<ITask>(`${API_URIS.taskApiUri}`, cleanEntity(entity))
                .then(res =>{
                    if(res.data){
                        setTask(res.data)
                        if(props.onUpdate)
                            props.onUpdate(res.data)
                    }
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }


    const userIsSubmitor = [...taskUserRoles].find(item => item.role === TaskUserRole.SUBMITOR) ? true : false;
    const userIsValidator = [...taskUserRoles].find(item => item.role === TaskUserRole.VALIDATOR) ? true : false;
    const userIsExecutor = [...taskUserRoles].find(item => item.role === TaskUserRole.EXCEUTOR) ? true : false;
    const withRiskManaging = true; // serviceIsOnline(SetupService.RISK);
    const hasTaskEditingPrivilege = account && hasPrivileges({ entities: [PrivilegeEntity.Task], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);
    const hasProcessEditingPrivileges = account && hasPrivileges({ entities: [PrivilegeEntity.Process], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);

    const canStart = !props.checkingOnly && task.status !== TaskStatus.STARTED && task.status !== TaskStatus.ON_PAUSE && (hasTaskEditingPrivilege || hasProcessEditingPrivileges);
    const canCancel = !props.checkingOnly && task.status !== TaskStatus.CANCELED && (hasTaskEditingPrivilege || hasProcessEditingPrivileges);
    const canExecute = prcess && !prcess.canceledAt && !props.checkingOnly && checked && ([TaskStatus.STARTED, TaskStatus.ON_PAUSE].some(st => st === task.status)) && userIsExecutor && taskHasSubmitorOrValidator;
    const canSubmit = prcess && !prcess.canceledAt && !props.checkingOnly && checked && ([TaskStatus.STARTED, TaskStatus.EXECUTED].some(st => st === task.status)) && userIsSubmitor;
    const canFinish = prcess && !prcess.canceledAt && !props.checkingOnly && checked && ((([TaskStatus.SUBMITTED, TaskStatus.ON_PAUSE].some(st => st === task.status)) && userIsValidator) || ([TaskStatus.STARTED, TaskStatus.EXECUTED, TaskStatus.SUBMITTED, TaskStatus.ON_PAUSE].some(ts => ts === task.status) && !taskHasSubmitorOrValidator && userIsExecutor));
    const canPlayOrPause = !props.checkingOnly && !props.inTodoList && withPlayOrPauseBtn && (task.status === TaskStatus.STARTED || task.status === TaskStatus.ON_PAUSE) && (hasProcessEditingPrivileges || hasTaskEditingPrivilege);
    const canDisableManualMode = prcess && !prcess.canceledAt && !props.checkingOnly && withManualModalRestBtn && task.manualMode &&  task.status !== TaskStatus.ON_PAUSE && (hasProcessEditingPrivileges || hasTaskEditingPrivilege)
    const canDelete = !props.checkingOnly && !props.inTodoList && account && task && props.onDelete && hasPrivileges({entities: ["Process", 'Task'], actions: [PrivilegeAction.DELETE]}, account.authorities);
    const canMangeHystory =  prcess && !prcess.canceledAt; // [...taskUserRoles].length !== 0 || hasPrivileges({entities: ["Process", 'Task'], actions: [PrivilegeAction.ALL]}, account.authorities);
    const canRestartPreviewTask = previewTasks && previewTasks.length !== 0; // && (canStart || canCancel || canExecute || canSubmit || canFinish || canDelete)
    const canReset = !props.checkingOnly && task.status !== TaskStatus.VALID && (hasTaskEditingPrivilege || hasProcessEditingPrivileges);

    const onDelete = (deletedId) =>{
        if(props.onDelete && deletedId){
            props.onDelete(deletedId);
            setOpenDeleterModal(false);
        }
    }

    const handleSelectPreviewTask = (t?: ITask, selected?: boolean) =>{
        setSelectedPreviewTask(t);
        setOpenTaskChooser(false);
        if(t){
            setAction(TaskStatus.STARTED);
            setOpenConfirm(true)
            setRelunchPrevTask(true)
        }
    }

    return (
        <React.Fragment>
            {loading && <CircularProgress style={{ width:15, height:15}}/>}
            {task && <>
                <EntityDeleterModal 
                    entityId={task.id}
                    open={openDeleterModal}
                    urlWithoutEntityId={API_URIS.taskApiUri}
                    onClose={() => setOpenDeleterModal(false)}
                    onDelete={onDelete}
                    question={translate("microgatewayApp.microprocessTask.delete.question", {id: task.name})}
                />
                <TaskWidgetChooser 
                    title={translate("_global.label.chooseTaskToStart")}
                    open={openTaskChooser}
                    multiple={false}
                    onChoiceValid={handleSelectPreviewTask}
                    onClose={() => setOpenTaskChooser(false)}
                    tasks={[...previewTasks]}
                />
            </>}
            {(task && prcess && prcess.modelId) && <>
                <TaskStatusTrakingModal
                     open={openTaskTacks} 
                     task={task} 
                     account={props.account}
                     userTaskRoles={[...taskUserRoles].map(tur => tur.role)}
                     onClose={() => setOpenTaskTracks(false)} />
                <TaskStatusTrakingUpdate
                    open={openConfirm}
                    task={(relunchPrevTask && selectedPreviewTask)? selectedPreviewTask : task}
                    newStatus={action} 
                    triggerTaskId={(relunchPrevTask && selectedPreviewTask && task) ? task.id : null}
                    onClose={handleCloseConfirm}
                    onChangeStatus={handleSave}
                    onSavedTraking={handleSaveTraking}/>
                <ProcessTasksLogsModal 
                    account={account}
                    processId={prcess.id}
                    process={prcess}
                    open={openAllProcessTasksLogs}
                    onClose={() => setOpenAllProcessTasksLogs(false)}
                />
                <Box
                    display="flex" justifyContent="center"
                    alignItems="center" {...rootBoxProps}
                >
                    {(prcess && prcess.id && prcess.modelId) && <>
                        <Tooltip 
                            {...toolTipProps}
                            title={`${translate("_global.label.processAllTasksLogs", {name: ""})}`}>
                            <IconButton
                                {...iconButtonProps}
                                onClick={() =>{setOpenAllProcessTasksLogs(true)}}
                                className="text-secondary ml-3" >
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faWindowRestore} />
                            </IconButton>
                        </Tooltip>
                    </>}
                    {canRestartPreviewTask && 
                        <Tooltip 
                            {...toolTipProps}
                            title={translate(`_global.label.startPreviewTask`)}>
                            <IconButton
                                {...iconButtonProps}
                                onClick={() =>{
                                    if(previewTasks && previewTasks.length === 1)
                                        handleSelectPreviewTask(previewTasks[0], true)
                                    else
                                      setOpenTaskChooser(true)
                                }}
                                className="text-secondary ml-3" >
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faStepBackward} />
                            </IconButton>
                        </Tooltip>
                    }
                    {canMangeHystory && 
                        <Tooltip 
                            {...toolTipProps}
                            title={translate("microgatewayApp.microprocessTaskStatusTraking.detail.title")}>
                            <IconButton
                                {...iconButtonProps}
                                onClick={() =>{ setOpenTaskTracks(true)}}
                                className="text-secondary ml-3" >
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faHistory} />
                            </IconButton>
                        </Tooltip>
                    }
                    {canPlayOrPause && 
                        <Tooltip 
                            {...toolTipProps}
                            title={task.status === TaskStatus.ON_PAUSE ? 'play' : 'pause'}>
                            <IconButton
                                {...iconButtonProps}
                                onClick={handlePlayOrPause}
                                className="text-secondary ml-3" >
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={task.status === TaskStatus.ON_PAUSE  ? faPlay : faPause} />
                            </IconButton>
                        </Tooltip>
                    }
                    {canDisableManualMode && 
                        <Tooltip 
                            {...toolTipProps}
                            title={translate('_global.label.disableManualMode')}>
                            <IconButton onClick={handleDisableManualMode}
                                 aria-label="disable manual mode" className="text-info ml-3">
                                 <FontAwesomeIcon 
                                     {...iconProps}
                                     icon={faSync} />
                            </IconButton>
                        </Tooltip>
                    }
                    {canFinish &&
                        <Tooltip 
                            {...toolTipProps}
                            title={translate(`_global.label.validate`)}>
                            <IconButton
                                {...iconButtonProps}
                                onClick={() =>{
                                    setAction(TaskStatus.COMPLETED);
                                    setOpenConfirm(true)
                                }}
                                className="text-success ml-3" >
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faCheckCircle} />
                            </IconButton>
                        </Tooltip>
                    }

                    {canStart &&
                        <Tooltip 
                            {...toolTipProps}
                            title={translate(`_global.label.start`)}>
                            <IconButton
                                {...iconButtonProps}
                                color="primary"
                                onClick={() =>{
                                    setAction(TaskStatus.STARTED);
                                    setOpenConfirm(true)
                                }}>
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faPlay} />
                            </IconButton>
                        </Tooltip>
                    }

                    {canExecute &&
                        <Tooltip 
                            {...toolTipProps}
                            title={translate(`_global.label.execute`)}>
                            <IconButton
                                {...iconButtonProps}
                                color="primary"
                                onClick={() =>{
                                    setAction(TaskStatus.EXECUTED);
                                    setOpenConfirm(true)
                                }}>
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faShieldAlt} />
                            </IconButton>
                        </Tooltip>
                    }

                    {canSubmit &&
                        <Tooltip 
                            {...toolTipProps}
                            title={translate(`_global.label.submit`)}>
                            <IconButton
                                {...iconButtonProps}
                                color="primary"
                                onClick={() =>{
                                    setAction(TaskStatus.SUBMITTED);
                                    setOpenConfirm(true)
                                }}>
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faPaperPlane} />
                            </IconButton>
                        </Tooltip>
                    }
                    {canReset &&
                        <Tooltip 
                            {...toolTipProps}
                            title={translate(`_global.label.resetTask`)}>
                            <IconButton
                                {...iconButtonProps}
                                color="inherit"
                                onClick={() =>{
                                    setAction(TaskStatus.VALID);
                                    setOpenConfirm(true)
                                }}>
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faRedoAlt} />
                            </IconButton>
                        </Tooltip>
                    }

                    {canCancel &&
                        <Tooltip 
                            {...toolTipProps}
                            title={translate(`_global.label.cancel`)}>
                            <IconButton
                                {...iconButtonProps}
                                color="secondary"
                                onClick={() =>{
                                    setAction(TaskStatus.CANCELED);
                                    setOpenConfirm(true)
                                }}>
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faBan} />
                            </IconButton>
                        </Tooltip>
                    }  
                    {canDelete &&
                        <Tooltip 
                            {...toolTipProps}
                            title={translate(`entity.action.delete`)}>
                            <IconButton
                                {...iconButtonProps}
                                color="secondary"
                                onClick={() =>{
                                    setOpenDeleterModal(true)
                                }}>
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faTrash} />
                            </IconButton>
                        </Tooltip>
                    }
                </Box>
            </>
            }
        </React.Fragment>
    )

}

const mapStateToProps = ({ authentication }: IRootState) =>({
    account: authentication.account
});

const mapDispatchToProps = {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskControl);