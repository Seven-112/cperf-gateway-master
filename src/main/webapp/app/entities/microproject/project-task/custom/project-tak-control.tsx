import { Box, BoxProps, CircularProgress, IconButton, IconButtonProps, makeStyles, Tooltip, TooltipProps } from "@material-ui/core";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { faBan, faCheckCircle, faHistory, faPaperPlane, faPause, faPlay, faShieldAlt, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { cleanEntity } from "app/shared/util/entity-utils";
import { translate } from "react-jhipster";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import ProjectTaskStatusTraking from "../../project-task-status-traking/custom/project-task-status-traking";
import ProjectTaskStatusTrakingUpdate from "../../project-task-status-traking/custom/project-task-status-traking-update";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { IProjectTaskUser } from "app/shared/model/microproject/project-task-user.model";
import { ProjectTaskUserRole } from "app/shared/model/enumerations/project-task-user-role.model";
import { IProjectTaskStatusTraking } from "app/shared/model/microproject/project-task-status-traking.model";
import { ProjectTaskStatus } from "app/shared/model/enumerations/project-task-status.model";
import { IProject } from "app/shared/model/microproject/project.model";

const useStyles = makeStyles(theme =>({

}))

interface TaskControlProps extends StateProps, DispatchProps{
    task: IProjectTask,
    realod?:boolean,
    rootBoxProps?: BoxProps,
    iconProps?: FontAwesomeIconProps,
    iconButtonProps?: IconButtonProps,
    toolTipProps?: TooltipProps,
    onUpdate?: Function,
    withPlayOrPauseBtn?: boolean,
    withManualModalRestBtn?:boolean,
    checkingOnly?: boolean,
    inTodoList?:boolean,
    onDelete?:Function,
}

export const ProjectTaskControl = (props: TaskControlProps) =>{
    const { rootBoxProps, account, iconProps, iconButtonProps, toolTipProps, withManualModalRestBtn,withPlayOrPauseBtn } = props;
    const [task, setTask] = useState(props.task);
    const [project, setProject] = useState<IProject>(null)
    const [loading, setLoading] = useState(false);
    const [taskUserRoles, setTaskUsersRole] = useState<IProjectTaskUser[]>([]);
    const [action, setAction] = useState<ProjectTaskStatus>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [hsitoriesCount, setHistoriesCount] = useState(0);
    const [openTaskTacks, setOpenTaskTracks] = useState(false);
    const [taskCheicked, setTaskCheicked] = useState(false);
    const [openDeleterModal, setOpenDeleterModal] = useState(false);
    const [taskHasSubmitorOrValidator, setTaskHasValidatorOrSubmotor] = useState(false);

    const classes = useStyles();

    const mergeTaskUserRoles = (roles: IProjectTaskUser[]) =>{
        if(userExtra && userExtra.employee && userExtra.employee.department && userExtra.employee.department.id === task.groupId){
            const tUserRole: IProjectTaskUser = {
                role: (serviceIsOnline(SetupService.RISK) && task.riskId) ? ProjectTaskUserRole.SUBMITOR : ProjectTaskUserRole.EXCEUTOR,
                taskId: task ? task.id : null,
                userId: userExtra.id
            }
            setTaskUsersRole([...roles, tUserRole]);
        }else{
            setTaskUsersRole([...roles]);
        }
    } 

    const checkTaskHasSubmitorOrValidator = () =>{
        if(task && task.id){
            const roles = [ProjectTaskUserRole.SUBMITOR, ProjectTaskUserRole.VALIDATOR];
            axios.get<IProjectTaskUser[]>(`${API_URIS.projectTaskUserApiUri}/?taskId.equals=${task.id}&role.in=${[roles].join(',')}&page=${0}&size=${1}`)
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

    const getTaskUsers = () =>{
        if(userExtra && task && task.id){
            setLoading(true)
            axios.get<IProjectTaskUser[]>(`${API_URIS.projectTaskUserApiUri}/?taskId.equals=${task.id}&userId.equals=${userExtra.id}`)
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

    const getProject = (projectId) =>{
        if(projectId){
            setLoading(true)
            axios.get<IProject>(`${API_URIS.projectApiUri}/${projectId}`)
                .then(res =>{
                    setProject(res.data)
                }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
        }
    }

    const countTaskHistories = () =>{
        if(props.task && props.task.id){
            axios.get<IProjectTaskStatusTraking>(`${API_URIS.projectTaskStatusTrakingApiUri}/?taskId.equals=${props.task.id}&page=${0}&size=${1}`)
                .then(res =>{
                    if(res.data)
                        setHistoriesCount(parseInt(res.headers['x-total-count'],10));
                }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
        }
    } /** dflkdlfk  */

    const cheickIsCheicked = () =>{
        if(props.task && props.task.id){
            setLoading(true);
            axios.get<boolean>(`${API_URIS.projectTaskApiUri}/isChecked/${props.task.id}`)
            .then(res => {
                setTaskCheicked(res.data);
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getUserExtra();
    }, [])

    useEffect(() =>{
        setTask(props.task);
        if(props.task)
            getProject(props.task.processId);
        getTaskUsers();
        countTaskHistories();
        cheickIsCheicked();
        checkTaskHasSubmitorOrValidator();
    }, [props.task, props.realod])

    useEffect(() =>{
        getTaskUsers();
    }, [userExtra])

    
    const handleSaveTraking = (saved?: IProjectTaskStatusTraking, isNew?: boolean) =>{}

    const handleSave = (saved?: IProjectTask) =>{
        if(saved){
            setTask(saved)
            if(props.onUpdate)
                props.onUpdate(saved);
        }
    }

    const handleCloseConfirm = () =>{
        setOpenConfirm(false);
        setAction(null);
    }


    const handlePlayOrPause = () =>{
        if(task){
            setLoading(true)
            const apiUri = `${API_URIS.projectTaskApiUri}/${task.status === ProjectTaskStatus.ON_PAUSE ? 'play' : 'pause'}`;
            axios.put<IProjectTask>(apiUri, cleanEntity(task)).then(res =>{
                if(res.data){
                    setTask(res.data);
                    if(props.onUpdate)
                        props.onUpdate(res.data)
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setLoading(false))
        }
    }

    const handleDisableManualMode = () =>{
        if(task){
            const entity: IProjectTask = {
                ...task, 
                manualMode: false,
            }
            setLoading(true)
            axios.put<IProjectTask>(`${API_URIS.projectTaskApiUri}`, cleanEntity(entity))
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


    const userIsSubmitor = [...taskUserRoles].find(item => item.role === ProjectTaskUserRole.SUBMITOR) ? true : false;
    const userIsValidator = [...taskUserRoles].find(item => item.role === ProjectTaskUserRole.VALIDATOR) ? true : false;
    const userIsExecutor = [...taskUserRoles].find(item => item.role === ProjectTaskUserRole.EXCEUTOR) ? true : false;
    const withRiskManaging = true; // serviceIsOnline(SetupService.RISK);
    const hasTaskEditingPrivilege = account && hasPrivileges({ entities: ['Project', 'ProjectTask'], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);
    const hasProcessEditingPrivileges = account && hasPrivileges({ entities: ['Project', 'ProjectTask'], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);

    const canStart = !props.checkingOnly && !props.inTodoList && task.status !== ProjectTaskStatus.STARTED && task.status !== ProjectTaskStatus.ON_PAUSE && (hasTaskEditingPrivilege || hasProcessEditingPrivileges);
    const canCancel = !props.checkingOnly && !props.inTodoList && task.status !== ProjectTaskStatus.CANCELED && (hasTaskEditingPrivilege || hasProcessEditingPrivileges);
    const canExecute = !props.checkingOnly && taskCheicked && [ProjectTaskStatus.STARTED,ProjectTaskStatus.ON_PAUSE].some(ts => ts === task.status) && userIsExecutor && taskHasSubmitorOrValidator;
    const canSubmit = !props.checkingOnly && taskCheicked && [ProjectTaskStatus.EXECUTED,ProjectTaskStatus.ON_PAUSE].some(ts => ts === task.status) && userIsSubmitor;
    const canFinish = !props.checkingOnly && taskCheicked && (([ProjectTaskStatus.SUBMITTED,ProjectTaskStatus.ON_PAUSE].some(ts => ts === task.status) && userIsValidator) || ([ProjectTaskStatus.STARTED, ProjectTaskStatus.ON_PAUSE, ProjectTaskStatus.EXECUTED, ProjectTaskStatus.SUBMITTED].some(ts => ts === task.status) && !taskHasSubmitorOrValidator && userIsExecutor));
    const canPlayOrPause = !props.checkingOnly && !props.inTodoList && withPlayOrPauseBtn && (task.status === ProjectTaskStatus.STARTED || task.status === ProjectTaskStatus.ON_PAUSE) && (hasProcessEditingPrivileges || hasTaskEditingPrivilege);
    const canDisableManualMode = !props.checkingOnly && withManualModalRestBtn && task.manualMode &&  task.status !== ProjectTaskStatus.ON_PAUSE && (hasProcessEditingPrivileges || hasTaskEditingPrivilege)
    const canDelete = !props.checkingOnly && !props.inTodoList && account && task && props.onDelete && hasPrivileges({entities: ["Process", 'Task'], actions: [PrivilegeAction.DELETE]}, account.authorities);
    const canMangeHystory =  true; // [...taskUserRoles].length !== 0 || hasPrivileges({entities: ["Process", 'Task'], actions: [PrivilegeAction.ALL]}, account.authorities);

    const onDelete = (deletedId) =>{
        if(props.onDelete && deletedId){
            props.onDelete(deletedId);
            setOpenDeleterModal(false);
        }
    }

    return (
        <React.Fragment>
            {loading && <CircularProgress style={{ width:15, height:15}}/>}
            {task && <>
                <EntityDeleterModal 
                    entityId={task.id}
                    open={openDeleterModal}
                    urlWithoutEntityId={API_URIS.projectTaskApiUri}
                    onClose={() => setOpenDeleterModal(false)}
                    onDelete={onDelete}
                    question={translate("microgatewayApp.microprocessTask.delete.question", {id: task.name})}
                />
            </>}
            {(task && project && project.valid) && <>
                <ProjectTaskStatusTraking
                    task={task} 
                    open={openTaskTacks}
                    account={props.account}
                    userTaskRoles={[...taskUserRoles].map(tur => tur.role)}
                    onClose={() => setOpenTaskTracks(false)} />
                <ProjectTaskStatusTrakingUpdate
                    open={openConfirm}
                    task={task} newStatus={action} 
                    onClose={handleCloseConfirm}
                    onChangeStatus={handleSave}
                    onSavedTraking={handleSaveTraking}/>
                {/* <ConfirmDialog open={openConfirm} onClose={handleCloseConfirm} onConfirm={handleConfirm} /> */}
                <Box
                    display="flex" justifyContent="center"
                    alignItems="center" {...rootBoxProps}
                >
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
                            title={task.status === ProjectTaskStatus.ON_PAUSE ? 'play' : 'pause'}>
                            <IconButton
                                {...iconButtonProps}
                                onClick={handlePlayOrPause}
                                className="text-secondary ml-3" >
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={task.status === ProjectTaskStatus.ON_PAUSE  ? faPlay : faPause} />
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
                                    setAction(ProjectTaskStatus.COMPLETED);
                                    setOpenConfirm(true)
                                }}
                                className="text-success ml-3" >
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faCheckCircle} />
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
                                    setAction(ProjectTaskStatus.CANCELED);
                                    setOpenConfirm(true)
                                }}>
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faBan} />
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
                                    setAction(ProjectTaskStatus.STARTED);
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
                                    setAction(ProjectTaskStatus.EXECUTED);
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
                                    setAction(ProjectTaskStatus.SUBMITTED);
                                    setOpenConfirm(true)
                                }}>
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faPaperPlane} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskControl);