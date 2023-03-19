import { faEye, faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@material-ui/core";
import { Close, Delete, Edit, Visibility } from "@material-ui/icons";
import { hasPrivileges } from "app/shared/auth/helper";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";
import { IProcess } from "app/shared/model/microprocess/process.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import { ITaskProcess } from "app/shared/model/projection/task-process.model";
import { API_URIS } from "app/shared/util/helpers";

import React, { useEffect, useState } from "react";import { translate, Translate } from "react-jhipster";
import { useHistory } from "react-router-dom";
import JustificationModal, { JustificationModalProps } from "../../justification/custom/justification-modal";
import TaskControl from "./tak-control";
import TaskChrono from "./task-chrono";
import TaskDetailModal from "./task-detail.modal";
import axios from 'axios'
import TaskUpdate from "./task-update";
import TaskItem from "../../task-item/custom/task-item";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import MyCustomPureHtmlRender, { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import { IQueryInstance } from "app/shared/model/qmanager/query-instance.model";
import QueryInstanceDetail from "app/entities/qmanager/query-instance/custom/query-instance-detail";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { formateDate } from "app/shared/util/date-utils";
import TaskUserTableColumn from "../../task-user/custom/task-user-table -column";

const useStyles = makeStyles(theme =>({
    card:{
        overflow: 'hidden',
        marginTop: theme.spacing(5),
        minHeight: theme.spacing(10),
        maxHeight: '85%',
        backgroundColor: 'transparent',
        border:0,
    },
    cardHeader:{
        background: 'white',
        color: theme.palette.primary.dark,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(0),
        borderRadius: '20px 20px 0 0',
    },
    theadRow:{
      backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
      color: 'white',
      '&>th':{
        color: 'white',
      }
    },
    cardContent:{
       maxHeight:'80%',
       overflow: 'auto',
       backgroundColor: theme.palette.background.paper,
    },
    cardActions:{
        color: theme.palette.primary.dark,
        background: theme.palette.background.paper,
        borderRadius: '0 0 20px 20px',
        padding: '2px 2px',
    },
    taskFileDescptionBox:{
        border:0,
        borderLeft: '5px solid',
        borderColor: theme.palette.primary.dark,
        marginRight: theme.spacing(1),
        maxHeight: theme.spacing(30),
        overflow:'auto',
    },
    taskFileValidationBox:{
        border:0,
        borderLeft: '5px solid',
        borderColor: theme.palette.success.dark,
    },
    catSelect:{
        fontSize:12,
        marginLeft: 5,
        color: theme.palette.grey[300],
        "&&&:before": {
          borderBottom: "none"
        },
        "&&:after": {
          borderBottom: "none"
        }
        // borderBottom: '1px solid white',
    },
    catSelectMenuItemList:{
        background: theme.palette.primary.dark,
        color: 'white',
    }
}))

export const TaskTableRow = (props: {task: ITask, parentTask: ITask,
     process: IProcess,realoadControl?:boolean,cheickingOnly?:boolean,
     withProcessColumn?: boolean,onViewDetail?: Function, closeUriOnEdit?: string, 
     onUpdate?: Function,handleOpenQueryInstance?: Function, onDelete?: Function,
     canDelete?: boolean, canUpdate?: boolean, inTodoList?:boolean, 
     userIsCurrentLogged: boolean, showUsersInColumn?: boolean, onTaskReload?: Function}) =>{
    const { parentTask, process, canDelete, canUpdate,userIsCurrentLogged } = props
    const [task, setTask] = useState(props.task);
    const [processParent, setProcessParent] = useState<IProcess>(null);
    const [laodingProcessParent, setLoadingProcessPrent] = useState(false);
    const [openTaskEditor, setOpenTaskEditor] = useState(false);
    const [openCheickList, setOpenCheickList] = useState(false);
    const [realoadControl, setReloadControl] = useState(props.realoadControl);
    const [openDescription, setOpenDescription] = useState(false);

    const [queryInstance, setQueryInstance] = useState<IQueryInstance>(null);
    const [loadingQuery, setLoadingQuery] = useState(false);
    const [openQuery, setOpenQuery] = useState(false);

    const classes = useStyles()

    const history = useHistory();

    const getProcessParent = () =>{
        if(process && process.modelId){
            setLoadingProcessPrent(true);
            axios.get<IProcess>(`${API_URIS.processApiUri}/${process.modelId}`)
                .then(res => {
                    setProcessParent(res.data);
                }).catch(e => console.log(e))
                    .finally(() => setLoadingProcessPrent(false))
        }
    }

    const reloadTask = () =>{
        if(task && task.id){
            axios.get<ITask>(`${API_URIS.taskApiUri}/${task.id}`)
                .then(res =>{
                    if(res.data){
                        setTask(res.data);
                        if(props.onTaskReload)
                            props.onTaskReload(res.data);
                    }
                }).catch(e => console.log(e))
        }
    }

    const getQueryInstance = () =>{
        if(props.process && props.process.queryId && serviceIsOnline(SetupService.QMANAGER) && props.handleOpenQueryInstance){
            setLoadingQuery(true);
            axios.get<IQueryInstance>(`${API_URIS.queryInstanceApiUri}/${props.process.queryId}`)
                .then(res => {
                    setQueryInstance(res.data);
                }).catch(e => console.log(e))
                .finally(() => setLoadingQuery(false))
        }
    }

    useEffect(() =>{
        getProcessParent();
        getQueryInstance();
    }, [])

    useEffect(() =>{
        setReloadControl(!realoadControl)
    }, [props.realoadControl])

    const handleEdit = () => setOpenTaskEditor(true)


    const handleDetail = () =>{
        if(props.onViewDetail){
            props.onViewDetail(task);
        }
        // history.push('/task/'+task.processId+'/'+task.id, { closeRedirectUri: '/process' });
    }

    

    const handleUpdate = (tsk?: ITask) =>{
        setTask(tsk);
        if(tsk && props.onUpdate)
            props.onUpdate(tsk);
    }

    const handleSaveEditedTask = (saved?: ITask, isNew?: boolean) =>{
        if(saved && !isNew){
            setTask(saved);
            if(props.onUpdate)
                props.onUpdate(saved);
        }
    }

    const handleDelete = () =>{
        if(props.onDelete)
            props.onDelete(task);
    }

    const handleOpenCheickList = () => setOpenCheickList(true);
    const handleCloseCheickList = () => setOpenCheickList(false);
    const handleCheckChange = () => {
        reloadTask();
        setReloadControl(!realoadControl);
    }

    const openLogigram = (processId) =>{
        if(processId)
            history.push(`/process/${processId}/logigram`)
    }

    const handleOpenQueryInstance = () =>{
        if(props.handleOpenQueryInstance && queryInstance)
            props.handleOpenQueryInstance(queryInstance);
    }
    
    const processName = process ? process.modelId ? processParent ? processParent.label : '...' : process.label : '...';
    const instanceName = process && process.modelId ? props.inTodoList ?
           <Button variant="text" style={{ textTransform: 'none'}} 
                onClick={() =>openLogigram(process.id)}>
               {<MyCustomPureHtmlRender body={process.label} renderInSpan />}
            </Button> 
         : <MyCustomPureHtmlRender body={process.label} renderInSpan /> : '...';
    return (
        <React.Fragment>
            {task && <>
                <TaskItem task={task} 
                open={openCheickList}
                onCheckChange={handleCheckChange}
                onClose={handleCloseCheickList}/>
                
                {task.description && <MyCustomPureHtmlRenderModal 
                        open={openDescription}
                        title={translate(`microgatewayApp.microprocessTask.description`)}
                        body={task.description}
                        onClose={() => setOpenDescription(false)}
                />}
            </> }
            {openTaskEditor && 
                <TaskUpdate
                    open={openTaskEditor} task={task} tProcess={process} 
                    onClose={() => setOpenTaskEditor(false)} onSave={handleSaveEditedTask}/>
            }
            <TableRow hover>
                <TableCell align="left">{task.name}</TableCell>
                <TableCell align="center">{task.description ?
                    <Tooltip onClick={() => setOpenDescription(true)}
                        title={translate(`microgatewayApp.microprocessTask.description`)} >
                        <IconButton color="primary" size="small" className="p-0">
                            <FontAwesomeIcon icon={faEye}/>
                        </IconButton>
                    </Tooltip> 
                    : '...'
                }
                </TableCell>
                 <TableCell align="center">{(process && process.createdAt) ? formateDate(new Date(process.createdAt), `DD/MM/yyyy ${translate("_global.label.to")} HH:mm`) : '...'}</TableCell>
                 <TableCell align="center">{task.startAt ? formateDate(new Date(task.startAt), `DD/MM/yyyy ${translate("_global.label.to")} HH:mm`) : '...'}</TableCell>
                 <TableCell align="center">{task.finishAt ? formateDate(new Date(task.finishAt), `DD/MM/yyyy ${translate("_global.label.to")} HH:mm`) : '...'}</TableCell>
                {props.withProcessColumn && <>
                 <TableCell align="center">{process && process.category ? process.category.name : '...'}</TableCell>
                 <TableCell align="center">{<MyCustomPureHtmlRender body={processName} renderInSpan />}</TableCell>
                 <TableCell align="center">{instanceName}</TableCell>
                 <TableCell align="center">
                     {loadingQuery ? 'loading...' : 
                        ((queryInstance && props.handleOpenQueryInstance) ?
                            <Tooltip title={translate("entity.action.show")}
                                onClick={handleOpenQueryInstance}>
                                <IconButton color="primary"
                                    size="small" className="p-0">
                                    <Visibility />
                                </IconButton> 
                            </Tooltip> : '...'
                        )}
                  </TableCell>
                 </>
                }
                {/* <TableCell align="center">
                    {<Translate contentKey={'microgatewayApp.ProcessPriority.'+getTaskPriorityLevel(task, process).toString()}>Priority</Translate>}
                </TableCell> */}
                {/* <TableCell align="center">{parentTask ? parentTask.name : '...'}</TableCell> */}
                <TableCell align="center">
                    {<Translate contentKey={'microgatewayApp.TaskStatus.'+task.status.toString()}>Status</Translate>}
                </TableCell>
                {props.showUsersInColumn && <TableCell align="center">
                    <TaskUserTableColumn taskId={props.task ? props.task.id : null} emtyText="..."/>
                </TableCell>}
                <TableCell align="center">
                    {(process && process.modelId) ? 
                    <TaskChrono task={task} process={process} onPlayOrPause={handleUpdate} /> : '...' }
                </TableCell>
                <TableCell align="center">
                    <Box display='flex' alignItems='center' justifyContent='center'>
                    <IconButton edge="start" 
                        aria-label={translate("microgatewayApp.microprocessTaskItem.home.title")}
                        title={translate("microgatewayApp.microprocessTaskItem.home.title")}
                        onClick={handleOpenCheickList}>
                        <FontAwesomeIcon icon={faTasks} size="sm"/>
                    </IconButton>
                    {!props.cheickingOnly && <>
                        {canUpdate && !props.inTodoList && 
                        <IconButton edge="start" onClick={handleEdit}>
                            <Edit color="primary" titleAccess={translate("entity.action.edit")}/>
                        </IconButton>}
                        {!props.inTodoList && 
                        <IconButton edge="start"  onClick={handleDetail}>
                            <Visibility color="secondary" titleAccess={translate("entity.action.show")}/>
                        </IconButton>}
                    </>}
                    {userIsCurrentLogged &&
                        <TaskControl task={task}
                            realod={realoadControl}
                            onUpdate={handleUpdate} 
                            inTodoList={props.inTodoList}
                            checkingOnly={props.cheickingOnly}
                            iconProps={{ icon: null, size: "xs" }} />
                    }
                    {!props.cheickingOnly && canDelete && !props.inTodoList && <>
                        <IconButton edge="start" aria-label="delete" onClick={handleDelete}>
                            <Delete color="secondary" titleAccess={translate("entity.action.delete")}/>
                        </IconButton>
                    </>}
                    </Box>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

interface ITaskListProps extends StateProps, DispatchProps{
    process?: IProcess,
    tasksProcesses: ITaskProcess[],
    withProcessColumn?: boolean,
    title?: any,
    hideTitile?:boolean,
    footer?: any,
    closeUriOnEdit?: string,
    onUpdate?: Function,
    onChangeTaskStatus?: Function,
    onClose?: Function, // necessary if is using in modal
    taskStatus?: TaskStatus, 
    disableStatusChange?: boolean,
    style?: any,
    headerStyle?:any,
    contentStyle?:any,
    footerStyle?:any,
    laoding?: boolean,
    checkingOnly?:boolean,
    inTodoList?:boolean,
    onDelete?:Function,
    onTaskReloaded?:Function,
    sortById?: boolean,
    showUsersInColumn?: boolean,
}

export const TaskList = (props: ITaskListProps) =>{

    const {account} = props;

    const [tasks, setTasks] = useState<ITask[]>(props.tasksProcesses ? [...props.tasksProcesses].map(kp => kp.task) : []);

    const [processes, setProcesses] = useState<IProcess[]>(props.tasksProcesses ? props.tasksProcesses.map(kp => kp.process) : []);

    const [searchValue, setSearchValue] = useState('')

    const classes = useStyles()

    const [queryInstance, setQueryInstance] = useState<IQueryInstance>(null);
    const [openQuery, setOpenQuery] = useState(false);
    

    const [activeTask, setActiveTask] = useState<ITask>(null);
    const [activeProcess, setActivProcess] = useState<IProcess>(props.process);
    const [taskToDelete, setTaskToDelete] = useState<ITask>(null);
    const [openTaskToDelete, setOpenTaskToDelete] = useState(false);

    const [taskDetailViewOpened, setTaskDetailViewOpened] = useState(false);

    const [justificationsModalProps, setJustificationModalProps] = useState<JustificationModalProps>(null);
    const [realoadControl, setReloadControl] = useState(false);

    // const [taskStatus, setTaskStatus] = useState(props.taskStatus);

    const sortTasks = () =>{
        if(props.tasksProcesses){
            const tsks = [...props.tasksProcesses.map(kp => kp.task)];
            if(props.process && !props.process.modelId)
                setTasks(tsks.sort((a,b) => a.id - b.id)); // asc sorting by id
            else
                setTasks(tsks); 
        }
    }

    useEffect(() =>{
        sortTasks();
        setProcesses(props.tasksProcesses ? [...props.tasksProcesses].map(kp => kp.process) : []);
    }, [props.tasksProcesses]);

    const handleOpenTaskView = (recievedTask: ITask) =>{
        /* eslint-disable no-console */
        console.log(recievedTask);
        if(recievedTask){
            setActiveTask(recievedTask);
            if(!activeProcess && processes){
                setActivProcess(processes.find(p => p.id === recievedTask.processId));
            }
            setTaskDetailViewOpened(true);
        }
    }

    const onCloseTaskDetailModal = (updatedTask?: ITask) =>{
        if(updatedTask){
            const entities = tasks.map(t =>{
                if(t.id === updatedTask.id)
                    return updatedTask;
                else
                    return t;
            });
            setTasks([...entities]);
        }else{
            setActiveTask(null);
        }
    }

    const handleSearchChange = (e) =>{
        setSearchValue(e.target.value);
    }

    const handleOpenJustifications = (jModalProps: JustificationModalProps) =>{
        setJustificationModalProps(jModalProps);
    }

    const handleUpdate = (updated?: ITask) =>{
        if(updated){
            setTasks([...tasks.map(t => t.id === updated.id ? updated : t)]);
            if(props.onUpdate)
             props.onUpdate(updated);
        }
    } 
    
    const handleTaskReloaded = (reloaded?: ITask) =>{
        if(reloaded){
            setTasks([...tasks.map(t => t.id === reloaded.id ? reloaded : t)]);
            if(props.onTaskReloaded)
                props.onTaskReloaded(reloaded);
        }
    }

    const handleChangeStatus = (e) =>{
        const newStatus = e.target.value;
        if(props.onChangeTaskStatus)
            props.onChangeTaskStatus(newStatus);

    }

    const handleOpenQueryInstance = (qi: IQueryInstance) =>{
        if(qi){
            setQueryInstance(qi);
            setOpenQuery(true);
        }
    }

    const handleClose = () =>{
        if(props.onClose)
            props.onClose();
    }

    const handleDelete = (task?: ITask) =>{
        if(task){
            setTaskToDelete(task);
            setOpenTaskToDelete(true);
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setTasks(tasks.filter(t => t.id !== deletedId));
            setOpenTaskToDelete(false)
            setTaskToDelete(null)
            if(props.onDelete)
                props.onDelete(deletedId);
        }
    }

    const canDelete =  props.account && hasPrivileges({entities: ["Process", 'Task'], actions: [PrivilegeAction.DELETE]}, props.account.authorities);
    const canUpdate =  props.account && hasPrivileges({entities: ["Process", 'Task'], actions: [PrivilegeAction.UPDATE]}, props.account.authorities);

    
    const items = [...tasks]
    .sort((a,b) => props.sortById ? a.id - b.id : 0)
    /* .sort((a,b) => sortByStatus(a,b)) */
    .filter(task => task.name && task.name.toLowerCase().includes(searchValue.toLowerCase()))
     .map(task => {
        const parent = tasks.find(t => t.id === task.parentId)
        const tProcess = props.process ? props.process : processes.find(p => p.id === task.processId)
        return <TaskTableRow key={task.id} task={task} parentTask ={parent} process={tProcess} 
                onViewDetail={handleOpenTaskView} withProcessColumn={props.withProcessColumn}
                 closeUriOnEdit={props.closeUriOnEdit ? props.closeUriOnEdit : null}
                 onUpdate={handleUpdate} canUpdate={canUpdate}
                 realoadControl={realoadControl}
                 cheickingOnly={props.checkingOnly}
                 inTodoList={props.inTodoList}
                 showUsersInColumn={props.showUsersInColumn}
                 userIsCurrentLogged={props.account && (props.account.id === props.todoUserId || !props.todoUserId)}
                 onDelete={handleDelete} canDelete={canDelete}
                 onTaskReload={handleTaskReloaded}
                 handleOpenQueryInstance={handleOpenQueryInstance}/>
    });
    

    return (
        <React.Fragment>
        {taskToDelete && canDelete && 
            <EntityDeleterModal 
                entityId={taskToDelete.id}
                open={openTaskToDelete}
                urlWithoutEntityId={API_URIS.taskApiUri}
                onClose={() => setOpenTaskToDelete(false)}
                onDelete={onDelete}
                question={translate("microgatewayApp.microprocessTask.delete.question", {id: taskToDelete.name})}
        />}
        { activeTask && <TaskDetailModal open={true} taskId={activeTask.id} 
            onClose={onCloseTaskDetailModal} onUpdate={handleUpdate}
            onCheckiListChange={() => setReloadControl(!realoadControl)}/> }
         {justificationsModalProps &&
          <JustificationModal open={true} process={justificationsModalProps.process} task={justificationsModalProps.task}
             reason={justificationsModalProps.reason} onClose={() => setJustificationModalProps(null)}/> }
             {/* main task list content */}
      
             {queryInstance && <QueryInstanceDetail 
                open={openQuery}
                instance={queryInstance}
                instanceId={queryInstance.id}
                onClose={() => setOpenQuery(false)}
               />
            }
            <Card className={classes.card} style={props.style}>
                <CardHeader
                    title={<Box display="flex" justifyContent="space-between" alignItems="center">
                            <FontAwesomeIcon icon={faTasks} className="mr-2"/>
                        {!props.hideTitile ? props.title ? props.title : translate('microgatewayApp.microprocessTask.home.title') : ''}
                        <CardSubHeaderInlineSearchBar 
                            onChange = {handleSearchChange}
                            />
                        </Box>}
                    titleTypographyProps={{
                        variant: 'h4'
                    }}
                    action={
                        <React.Fragment>
                            {props.onClose && 
                                <IconButton onClick={handleClose} color="inherit">
                                    <Close />
                                </IconButton>
                                }
                        </React.Fragment>
                    }
                style={props.headerStyle}
                classes={{ root: classes.cardHeader}}
                />
                <CardContent className={classes.cardContent} style={props.contentStyle}>
                    <Table>
                        <TableHead>
                            <TableRow className={classes.theadRow}>
                                <TableCell align="left">{translate('microgatewayApp.microprocessTask.name')}</TableCell>
                                <TableCell align="center">{translate('microgatewayApp.microprocessTask.description')}</TableCell>
                                <TableCell align="center">{translate('microgatewayApp.microprocessProcess.createdAt')}</TableCell>
                                <TableCell align="center">{translate('microgatewayApp.microprocessTask.startAt')}</TableCell>
                                <TableCell align="center">{translate('microgatewayApp.microprocessTask.finishAt')}</TableCell>
                                {props.withProcessColumn && <>
                                    <TableCell align="center">{translate('microgatewayApp.microprocessProcessCategory.detail.title')}</TableCell> 
                                    <TableCell align="center">{translate('microgatewayApp.microprocessProcess.detail.title')}</TableCell>
                                    <TableCell align="center">Instance</TableCell>
                                    <TableCell align="center">{translate('microgatewayApp.qmanagerQuery.detail.title')}</TableCell>
                                    </>
                                 }
                                {/* <TableCell align="center">{translate('microgatewayApp.microprocessTask.priorityLevel')}</TableCell> */}
                                {/* <TableCell align="center">{translate('microgatewayApp.microprocessTask.parentId')}</TableCell> */}
                                <TableCell align="center">
                                    {translate('microgatewayApp.microprocessTask.status')}
                                    {(props.onChangeTaskStatus && !props.disableStatusChange) &&
                                    <>
                                        {props.checkingOnly ? (
                                            <Select
                                                style={{fontSize: '12px',}}
                                                value={props.taskStatus}
                                                onChange={handleChangeStatus}
                                                MenuProps={{
                                                    classes: {
                                                        list: classes.catSelectMenuItemList,
                                                    }
                                                }}
                                                classes={{
                                                    icon: 'text-white'
                                                }}
                                                className={classes.catSelect}
                                                
                                            >
                                                <MenuItem value="STARTED">{translate('microgatewayApp.TaskStatus.STARTED')}</MenuItem>
                                               {/*  <MenuItem value="EXECUTED">{translate('microgatewayApp.TaskStatus.EXECUTED')}</MenuItem>
                                                <MenuItem value="SUBMITTED">{translate('microgatewayApp.TaskStatus.SUBMITTED')}</MenuItem> */}
                                                <MenuItem value="ON_PAUSE">{translate('microgatewayApp.TaskStatus.ON_PAUSE')}</MenuItem>
                                                <MenuItem selected={!props.taskStatus} value="">{translate('_global.label.all')}</MenuItem>
                                            </Select>
                                        ):(
                                            <Select
                                                style={{fontSize: '12px',}}
                                                value={props.taskStatus}
                                                onChange={handleChangeStatus}
                                                MenuProps={{
                                                    classes: {
                                                        list: classes.catSelectMenuItemList,
                                                    }
                                                }}
                                                classes={{
                                                    icon: 'text-white'
                                                }}
                                                className={classes.catSelect}
                                                
                                            >
                                                <MenuItem value="STARTED">{translate('microgatewayApp.TaskStatus.STARTED')}</MenuItem>
                                                {/* <MenuItem value="EXECUTED">{translate('microgatewayApp.TaskStatus.EXECUTED')}</MenuItem>
                                                <MenuItem value="SUBMITTED">{translate('microgatewayApp.TaskStatus.SUBMITTED')}</MenuItem> */}
                                                <MenuItem value="COMPLETED">{translate('microgatewayApp.TaskStatus.COMPLETED')}</MenuItem>
                                                <MenuItem value="CANCELED">{translate('microgatewayApp.TaskStatus.CANCELED')}</MenuItem>
                                                <MenuItem value="ON_PAUSE">{translate('microgatewayApp.TaskStatus.ON_PAUSE')}</MenuItem>
                                                <MenuItem value="VALID">{translate('microgatewayApp.TaskStatus.VALID')}</MenuItem>
                                                <MenuItem selected={!props.taskStatus} value="">{translate('_global.label.all')}</MenuItem>
                                            </Select>
                                        )}
                                    </>}
                                </TableCell>
                                 {props.showUsersInColumn && 
                                    <TableCell align="center">{translate(`microgatewayApp.microprocessTaskUser.home.title`)}</TableCell>
                                 }
                                <TableCell align="center">{translate('_global.label.chrono')}</TableCell>
                                <TableCell align="center">{"Actions"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.laoding && 
                                <TableRow>
                                    <TableCell align="center" colSpan={20}>
                                        loading...
                                    </TableCell>
                                </TableRow>
                            }
                            {!props.laoding && items}
                            {!props.laoding && items.length <=0 && 
                            <TableRow>
                                <TableCell align="center" colSpan={20}>
                                    <Translate contentKey="microgatewayApp.microprocessTask.home.notFound"></Translate>
                                </TableCell>
                            </TableRow>
                            }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardActions className={classes.cardActions} style={props.footerStyle}>
                    {props.footer}
                </CardActions>
            </Card>
        </React.Fragment>
    )
}


const mapStateToProps = ({ authentication, appUtils }: IRootState) =>({
    account: authentication.account,
    todoUserId: appUtils.todoUserId,
});

const mapDispatchToProps = {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(TaskList);