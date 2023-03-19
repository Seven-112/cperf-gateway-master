import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import { Add, Close, Delete, Edit, Visibility } from "@material-ui/icons";
import { hasPrivileges } from "app/shared/auth/helper";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { API_URIS, getProjectTaskPriorityLevel } from "app/shared/util/helpers";

import React, { useEffect, useState } from "react";import { translate, Translate } from "react-jhipster";
import ProjectTaskControl from "./project-tak-control";
import ProjectTaskChrono from "./project-task-chrono";
import TaskDetailModal from "./project-task-detail.modal";
import ProjectTaskUpdate from "./project-task-update";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { IProject } from "app/shared/model/microproject/project.model";
import { ProjectTaskStatus } from "app/shared/model/enumerations/project-task-status.model";
import ProjectTaskItem from "../../project-task-item/custom/project-task-item";
import { IProjectTask, defaultValue as defaultTask } from "app/shared/model/microproject/project-task.model";
import { ITaskProject } from "app/shared/model/projection/task-project.model";
import axios from 'axios';
import { cleanEntity } from "app/shared/util/entity-utils";

const useStyles = makeStyles(theme =>({
    card:{
        overflow: 'hidden',
        marginTop: theme.spacing(5),
        minHeight: theme.spacing(10),
        maxHeight: '85%',
        backgroundColor: 'transparent',
        border:0,
        width:'100%',
        boxShadow: 'none',
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
    },
    pondInput:{
        height:10,
        width:50,
        textAlign:'center',
    },
}))

export const TaskTableRow = (props: {task: IProjectTask, parentTask: IProjectTask,
     project: IProject,realoadControl?:boolean,cheickingOnly?:boolean,readonly?:boolean
     withprojectColumn?: boolean,onViewDetail?: Function,
     closeUriOnEdit?: string, todoUserCurrentLogged: boolean,
     onUpdate?: Function, onDelete?: Function, canUpdate?: boolean, canDelete?: boolean}) =>{
    const {parentTask, project, canDelete,canUpdate, readonly} = props
    const [task, setTask] = useState(props.task);
    const [openTaskEditor, setOpenTaskEditor] = useState(false);
    const [openCheickList, setOpenCheickList] = useState(false);
    const [realoadControl, setReloadControl] = useState(props.realoadControl);

    const classes = useStyles();

    useEffect(() =>{
        setReloadControl(!realoadControl)
        setTask(props.task);
    }, [props.realoadControl, props.task])

    const handleEdit = () => setOpenTaskEditor(true)


    const handleDetail = () =>{
        if(props.onViewDetail){
            props.onViewDetail(task);
        }
        // history.push('/task/'+task.projectId+'/'+task.id, { closeRedirectUri: '/project' });
    }
    

    const handleUpdate = (tsk?: IProjectTask) =>{
        setTask(tsk);
        if(tsk && props.onUpdate)
            props.onUpdate(tsk);
    }

    const handleSaveEditedTask = (saved?: IProjectTask, isNew?: boolean) =>{
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
    const handleCheckChange = () => setReloadControl(!realoadControl);
    
    return (
        <React.Fragment>
            {task && <ProjectTaskItem task={task} 
            open={openCheickList}
            onCheckChange={handleCheckChange}
            onClose={handleCloseCheickList}/>}
            {openTaskEditor && 
                <ProjectTaskUpdate
                    open={openTaskEditor} task={task} project={project}
                    onClose={() => setOpenTaskEditor(false)} onSave={handleSaveEditedTask}/>
            }
            <TableRow hover>
                <TableCell align="left">{task.name}</TableCell>
                {props.withprojectColumn && <>
                 <TableCell align="center">{project && project.categoryId ? project.categoryId : '...'}</TableCell>
                 <TableCell align="center">{project.label}</TableCell>
                 </>
                }
                <TableCell align="center">
                    {<Translate contentKey={'microgatewayApp.ProjectPriority.'+getProjectTaskPriorityLevel(task, project).toString()}>Priority</Translate>}
                </TableCell>
                <TableCell align="center">{task.ponderation || 1}</TableCell>
                <TableCell align="center">{parentTask ? parentTask.name : '...'}</TableCell>
                <TableCell align="center">
                    {<Translate contentKey={'microgatewayApp.TaskStatus.'+task.status.toString()}>Status</Translate>}
                </TableCell>
                <TableCell align="center">
                    {(project) ? 
                        <ProjectTaskChrono task={task} 
                            hideActionButton={readonly} onPlayOrPause={handleUpdate} />
                     : '...' }
                </TableCell>
                <TableCell align="center">
                    <Box display='flex' alignItems='center' justifyContent='center'>
                        {!readonly && <>
                            <IconButton edge="start" 
                                aria-label={translate("microgatewayApp.microprojectTaskItem.home.title")}
                                title={translate("microgatewayApp.microprojectTaskItem.home.title")}
                                onClick={handleOpenCheickList}>
                                <FontAwesomeIcon icon={faTasks} size="sm"/>
                            </IconButton>
                            {!props.cheickingOnly && <>
                                {canUpdate && 
                                <IconButton edge="start" aria-label="Edit" onClick={handleEdit}>
                                    <Edit color="primary" titleAccess="Edit"/>
                                </IconButton>}
                                <IconButton edge="start" aria-label="Edit" onClick={handleDetail}>
                                    <Visibility color="secondary" titleAccess="show"/>
                                </IconButton>
                                {props.todoUserCurrentLogged &&
                                    <ProjectTaskControl task={task}
                                        realod={realoadControl}
                                        onUpdate={handleUpdate} 
                                        iconProps={{ icon: null, size: "xs" }} /> 
                                }
                            </>}
                            {!props.cheickingOnly && canDelete && <>
                                <IconButton edge="start" aria-label="Edit" onClick={handleDelete}>
                                    <Delete color="secondary" titleAccess={translate("entity.action.delete")}/>
                                </IconButton>
                            </>}
                        </>}
                    </Box>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

interface IProjectTaskListProps extends StateProps, DispatchProps{
    project?: IProject,
    tasksProjects: ITaskProject[],
    withprojectColumn?: boolean,
    title?: any,
    hideTitile?:boolean,
    readonly?: boolean,
    footer?: any,
    closeUriOnEdit?: string,
    onUpdate?: Function,
    onChangeTaskStatus?: Function,
    onClose?: Function, // necessary if is using in modal
    taskStatus?: ProjectTaskStatus,
    disableStatusChange?: boolean, 
    onProjectUpdate?: Function,
    style?: any,
    headerStyle?:any,
    contentStyle?:any,
    footerStyle?:any,
    laoding?: boolean,
    checkingOnly?:boolean,
    onDelete?:Function,
    onCreate?: Function,
}

export const ProjectTaskList = (props: IProjectTaskListProps) =>{

    const {account} = props;
    const [project, setProject] = useState(props.project)

    const [tasks, setTasks] = useState<IProjectTask[]>(props.tasksProjects ? [...props.tasksProjects].map(kp => kp.task) : []);

    const [projectes, setprojectes] = useState<IProject[]>(props.tasksProjects ? props.tasksProjects.map(kp => kp.project) : []);

    const [searchValue, setSearchValue] = useState('')

    const [showGlobalPond, setShowGlobalPond] = useState(false);

    const classes = useStyles()
    

    const [activeTask, setActiveTask] = useState<IProjectTask>(null);
    const [activeproject, setActivproject] = useState<IProject>(props.project);
    const [taskToDelete, setTaskToDelete] = useState<IProjectTask>(null);
    const [openTaskToDelete, setOpenTaskToDelete] = useState(false);
    const [openToCreate, setOpenToCreate] = useState(false);

    const [taskDetailViewOpened, setTaskDetailViewOpened] = useState(false);

    // const [justificationsModalProps, setJustificationModalProps] = useState<JustificationModalProps>(null);
    const [realoadControl, setReloadControl] = useState(false);

    // const [taskStatus, setTaskStatus] = useState(props.taskStatus);

    const toogleGlobalPondérationDisplay = () =>{
        if(props.project && props.project.id && props.tasksProjects && props.tasksProjects.length !== 0){
            axios.get<IProject[]>(`${API_URIS.projectApiUri}/?parentId.equals=${props.project.id}&valid.equals=${true}&page=${0}&size=${1}`)
            .then(res =>{
                 if(res.data && res.data.length !== 0)
                    setShowGlobalPond(true);
                 else
                    setShowGlobalPond(false);
            }).catch(e => console.log(e))
        }else{
            setShowGlobalPond(false);
        }
    }

    useEffect(() =>{
        setTasks(props.tasksProjects ? [...props.tasksProjects.map(kp => kp.task)] : []);
        setprojectes(props.tasksProjects ? [...props.tasksProjects].map(kp => kp.project) : []);
        toogleGlobalPondérationDisplay();
    }, [props.tasksProjects]);

    useEffect(() =>{
        setProject(props.project);
    }, [props.project])

    const handleOpenTaskView = (recievedTask: IProjectTask) =>{
        if(recievedTask){
            setActiveTask(recievedTask);
            if(!activeproject && projectes){
                setActivproject(projectes.find(p => p.id === recievedTask.processId));
            }
            setTaskDetailViewOpened(true);
        }
    }

    const onCloseTaskDetailModal = (updatedTask?: IProjectTask) =>{
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

    /* const handleOpenJustifications = (jModalProps: JustificationModalProps) =>{
        setJustificationModalProps(jModalProps);
    } */

    const handleUpdate = (updated?: IProjectTask) =>{
        if(updated){
            setTasks([...tasks.map(t => t.id === updated.id ? updated : t)]);
            if(props.onUpdate)
             props.onUpdate(updated);
        }
    }

    const handleChangeStatus = (e) =>{
        const newStatus = e.target.value;
        if(props.onChangeTaskStatus)
            props.onChangeTaskStatus(newStatus);

    }

    const handleClose = () =>{
        if(props.onClose)
            props.onClose();
    }

    const handleDelete = (task?: IProjectTask) =>{
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

    const onCreate = (saved?: IProjectTask, isNew?: boolean) =>{
        if(saved){
            if(isNew){
                setTasks([...tasks, saved])
                if(props.onCreate)
                    props.onCreate(saved, isNew)
            }else{
                setTasks(tasks.map(t => t.id === saved.id ? saved : t));
                if(props.onUpdate)
                    props.onUpdate(saved, isNew);
            }
            setOpenToCreate(false);
        }
    }

    const canDelete =  props.account && hasPrivileges({entities: ["Project", 'Task'], actions: [PrivilegeAction.DELETE]}, props.account.authorities);
    const canCreate =  props.account && project && props.onCreate && hasPrivileges({entities: ["Project", 'Task'], actions: [PrivilegeAction.CREATE]}, props.account.authorities);
    const canUpdate =  props.account && hasPrivileges({entities: ["Project", 'Task'], actions: [PrivilegeAction.UPDATE]}, props.account.authorities);
    const todoUserCurrentLogged = props.account && (props.account.id === props.todoUserId || !props.todoUserId);
    
    const items = [...tasks].filter(task => task.name && task.name.toLowerCase().includes(searchValue.toLowerCase()))
     .map(task => {
        const parent = tasks.find(t => t.id === task.parentId)
        const tproject = props.project ? props.project : projectes.find(p => p.id === task.processId)
        return <TaskTableRow key={task.id} task={task} parentTask ={parent} project={tproject} 
                onViewDetail={handleOpenTaskView} withprojectColumn={props.withprojectColumn}
                 closeUriOnEdit={props.closeUriOnEdit ? props.closeUriOnEdit : null}
                 onUpdate={handleUpdate} realoadControl={realoadControl}
                 todoUserCurrentLogged={todoUserCurrentLogged}
                 cheickingOnly={props.checkingOnly} readonly={props.readonly}
                 onDelete={handleDelete} canDelete={canDelete} canUpdate={canUpdate}/>
    });
    
    const handleChangeGlobalPonderation = (e) =>{
        if(!props.readonly){
            const value = e.target.value;
            setProject({...project, taskGlobalPonderation: Number(value)})
        }else{
            e.preventDefault();
        }
    }

    const saveProjectTaskGlobalPonderation = () =>{
        if(project && project.id && !props.readonly){
            axios.put<IProject>(`${API_URIS.projectApiUri}`, cleanEntity(project))
                .then((res) =>{
                    if(res.data && props.onProjectUpdate)
                        props.onProjectUpdate(res.data);
                }).catch(e => console.log(e))
        }
    }

    return (
        <React.Fragment>
        {taskToDelete && canDelete && 
            <EntityDeleterModal 
                entityId={taskToDelete.id}
                open={openTaskToDelete}
                urlWithoutEntityId={API_URIS.projectTaskApiUri}
                onClose={() => setOpenTaskToDelete(false)}
                onDelete={onDelete}
                question={translate("microgatewayApp.microprojectProjectTask.delete.question", {id: taskToDelete.name})}
        />}
        { activeTask && <TaskDetailModal open={true} taskId={activeTask.id} 
            onClose={onCloseTaskDetailModal} onUpdate={handleUpdate}
            onCheckiListChange={() => setReloadControl(!realoadControl)}/> }
        {canCreate &&
            <ProjectTaskUpdate
                open={openToCreate} task={defaultTask} project={project}
                onClose={() => setOpenToCreate(false)} onSave={onCreate}/>}
         {/* {justificationsModalProps &&
          <JustificationModal open={true} project={justificationsModalProps.project} task={justificationsModalProps.task}
             reason={justificationsModalProps.reason} onClose={() => setJustificationModalProps(null)}/> } */}
             {/* main task list content */}
            <Card className={classes.card} style={props.style}>
                <CardHeader
                    title={<Box display="flex" justifyContent="space-between" alignItems="center">
                            <FontAwesomeIcon icon={faTasks} className="mr-2"/>
                        {!props.hideTitile ? props.title ? props.title : translate('microgatewayApp.microprojectProjectTask.home.title'):''}
                        <CardSubHeaderInlineSearchBar 
                            onChange = {handleSearchChange}
                            />
                        {(showGlobalPond && account && hasPrivileges({entities: ['Project'], actions: [PrivilegeAction.UPDATE, PrivilegeAction.CREATE]}, account.authorities)) && 
                         <Box display="flex" alignItems="center">
                            <Typography className="mr-2">
                                {translate("microgatewayApp.microprojectProject.taskGlobalPonderation")}
                            </Typography>
                            <TextField 
                                value={project.taskGlobalPonderation || 1}
                                variant="outlined" size="small"
                                type="number"
                                inputProps={{
                                    className: classes.pondInput,
                                    min: 1,
                                    step:1,
                                }}
                                onChange={handleChangeGlobalPonderation}
                                onBlur={saveProjectTaskGlobalPonderation}
                            />
                        </Box>}
                        </Box>}
                    titleTypographyProps={{
                        variant: 'h4'
                    }}
                    action={
                        <React.Fragment>
                            {canCreate && 
                                <IconButton onClick={() => setOpenToCreate(true)} color="inherit">
                                    <Add />
                                </IconButton>
                            }
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
                                <TableCell align="left">{translate('microgatewayApp.microprojectProjectTask.name')}</TableCell>
                                {props.withprojectColumn && <>
                                    <TableCell align="center">{translate('microgatewayApp.microprojectProjectCategory.detail.title')}</TableCell> 
                                    <TableCell align="center">{translate('microgatewayApp.microprojectProject.detail.title')}</TableCell>
                                    </>
                                 }
                                <TableCell align="center">{translate('microgatewayApp.microprojectProjectTask.priorityLevel')}</TableCell>
                                <TableCell align="center">{translate('microgatewayApp.microprojectProjectTask.ponderation')}</TableCell>
                                <TableCell align="center">{translate('microgatewayApp.microprojectProjectTask.parentId')}</TableCell>
                                <TableCell align="center">
                                    {translate('microgatewayApp.microprojectProjectTask.status')}
                                    {(props.onChangeTaskStatus && !props.disableStatusChange) && <>
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
                                                {/* <MenuItem value="EXECUTED">{translate('microgatewayApp.TaskStatus.EXECUTED')}</MenuItem>
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
                                    <Translate contentKey="microgatewayApp.microprojectProjectTask.home.notFound"></Translate>
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


const mapStateToProps = ({ authentication,appUtils }: IRootState) =>({
    account: authentication.account,
    todoUserId: appUtils.todoUserId,
});

const mapDispatchToProps = {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskList);