import { alpha, Badge, Box, Button, CardHeader, CircularProgress, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { IProject } from "app/shared/model/microproject/project.model";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { TreeItem } from "@material-ui/lab";
import theme from "app/theme";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faSitemap, faStream } from "@fortawesome/free-solid-svg-icons";
import { Add, Delete, Edit, List, Visibility } from "@material-ui/icons";
import ProjectUpdate from "./project-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import ProjectComment from "../../project-comment/custom/project-comment";
import { ProjectTasksModal } from "./project-tasks-modal";
import { ProjectLogigramModal } from "./project-logigram-modal";
import { ProjectDeleteMode } from "app/shared/model/enumerations/project-delete-mode";
import ProjectGanttModal from "./project-gantt-modal";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import { IChronoUtil } from "app/shared/util/chrono-util.model";
import ChronoVisualizer from "app/shared/component/chrono-visualizer";
import clsx from "clsx";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { ProjectTaskStatus } from "app/shared/model/enumerations/project-task-status.model";

const useStyles = makeStyles({
    treeGroup:{
        marginLeft: 15,
        paddingLeft: 5,
        borderLeft: `1px dashed ${alpha(theme.palette.text.disabled, 0.4)}`,
    },
    treeContent:{
        boxShadow: `1px 1px 1px`,
        marginBottom: 15,
    },
    btn:{
        color: theme.palette.primary.dark,
    },
    deleteBtn:{
        color: theme.palette.secondary.main,
    },
})

interface ProjectTreeItemProps{
    project: IProject,
    account: any,
    searchTerm?: string,
    onDelete?: Function 
    onUpdate?: Function,
    handleReloadProgress?: Function
}

const ProjectTreeItem = (props: ProjectTreeItemProps) =>{
    const { searchTerm, account, project } = props;
    const [loading, setLoading] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);

    const [projectToUpdate, setProjectToUpdate] = useState<IProject>(null);

    const [projects, setProjects] = useState<IProject[]>([]);
    const [nbTasks, setNbTasks] = useState(0);

    const [projectProgressPercent, setProjectProgressPercent] = useState(0);
    const [loadingProgress,setLoadingProgress] = useState(false);

    const [openToUpdate, setOpenToUpdate] = useState(false);
    const [openToDelete, setOpenToDelete] = useState(false);
    const [deleteMode, setDeleteMode] = useState(ProjectDeleteMode.DELETE_WITH_CHILDREN);
    const [openComment, setOpenComment] = useState(false);
    const [openTasks, setOpenTasks] = useState(false);
    const [openLogigram, setOpenLogigram] = useState(false);
    const [openGantt, setOpenGantt] = useState(false);
    const [chronoUtil, setChronoUtil] = useState<IChronoUtil>(null);
    const [chrnonLoaing, setChronoLoading] = useState(false);
    
    const canUpdate = account && hasPrivileges({ entities: ['Project'], actions: [PrivilegeAction.UPDATE]}, account.authorities);
    const canDelete = account && (!projects || projects.length === 0) && 
                     hasPrivileges({ entities: ['Project'], actions: [PrivilegeAction.DELETE]}, account.authorities);
    const canCreate = account && hasPrivileges({ entities: ['Project'], actions: [PrivilegeAction.CREATE]}, account.authorities);

    const classes = useStyles();

    const countTasks = () =>{
        if(props.project && props.project.id){
            const status = [
                ProjectTaskStatus.COMPLETED,
                ProjectTaskStatus.EXECUTED,
                ProjectTaskStatus.ON_PAUSE,
                ProjectTaskStatus.STARTED,
                ProjectTaskStatus.SUBMITTED,
                ProjectTaskStatus.VALID
            ].map(s => s.toString()).join(',')
            let uri = `${API_URIS.projectTaskApiUri}/?processId.equals=${props.project.id}`;
            uri = `${uri}&status.in=${status}&page=${0}&size=${1}`
            axios.get<IProjectTask[]>(uri).then(res =>{
                setNbTasks(parseInt(res.headers['x-total-count'], 10));
            }).catch(e => console.log(e))
        }
    }

    const getChildren = () =>{
        if(props.project && props.project.id){
            setLoading(true)
            axios.get<IProject[]>(`${API_URIS.projectApiUri}/?valid.equals=${true}&parentId.equals=${props.project.id}&sort=path`)
                .then(res =>{
                    setProjects([...res.data])
                }).catch((e) => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    const getChronoData = () =>{
        if(props.project && props.project.id){
            setChronoLoading(true)
            axios.get<IChronoUtil>(`${API_URIS.projectApiUri}/getChronoUtil/${props.project.id}`)
                .then(res =>{
                    setChronoUtil(res.data)
                }).catch((e) => console.log(e))
                .finally(() => setChronoLoading(false))
        }    
    }

    const getProgress = () =>{
        if(props.project && props.project.id){
            setLoadingProgress(true)
            axios.get<number>(`${API_URIS.projectApiUri}/progress/${props.project.id}`)
                .then(res => {
                    setProjectProgressPercent(res.data)
                })
                .catch(e => console.log(e))
                .finally(() => setLoadingProgress(false))
        }
        if(props.handleReloadProgress)
            props.handleReloadProgress();
    }

    useEffect(() =>{
        getChildren();
        getChronoData();
        getProgress();
        countTasks();
    }, [props.project]);

    const onDeleteChildren = (deletedId?: any) =>{
        if(deletedId){
            setProjects(projects.filter(p => p.id !== deletedId));
            getChildren();
            getProgress();
        }
            
    }
    
    const searchFilter = (p?: IProject) =>{
        if(p){
            const term = !searchTerm ? '' : searchTerm.toLowerCase();
            return (!p.label || p.label.toLowerCase().includes(term));
        }
        return false;
    }

    const handleUpdate = (p?: IProject) =>{
        if(!p)
            setProjectToUpdate({ parentId: project.id });
        else
            setProjectToUpdate(p);
        setOpenToUpdate(true);
    }

    const onSave = (saved: IProject, isNew?: boolean) =>{
        if(saved){
            if(isNew){
                setProjects([...projects, saved])
            }else{
                if(props.onUpdate)
                    props.onUpdate(saved, isNew);
            }
            setOpenToUpdate(false);
            getProgress();
        }
    }

    const onChildrenUpdate = (saved?: IProject, isNew?: boolean) =>{
        if(saved){
            if(isNew){
                setProjects([...projects, saved])
            }else{
                setProjects(projects.map(p => p.id === saved.id ? saved : p));
            }
            setOpenToUpdate(false);
            getProgress();
        }
    }
    
    const handleDelete = (e) =>{
        setOpenToDelete(true);
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            if(project && project.id === deletedId){
                if(props.onDelete)
                    props.onDelete(deletedId);
            }else{
                setProjects(projects.filter(p => p.id !== deletedId));
            }
            setOpenToDelete(false);
            getProgress();
        }
    }

    const handleUpdateProgress = () =>{
        getProgress();
        if(props.handleReloadProgress)
            props.handleReloadProgress();
    }

    const handleTaskDeleted = () =>{
        if(nbTasks !== 0)
            setNbTasks(nbTasks -1);
    }

    const handleCreatedTask = () =>{
        getProgress();
        setNbTasks(nbTasks +1);
    }
    

    return (
        <React.Fragment>
            {project && <>
                <ProjectUpdate
                    open={openToUpdate}
                    project={projectToUpdate}
                    onClose={() => setOpenToUpdate(false)}
                    onSave={onSave}
                />
                <EntityDeleterModal
                    open={openToDelete}
                    entityId={project.id}
                    urlWithoutEntityId={API_URIS.projectApiUri}
                    onClose={() => setOpenToDelete(false)}
                    onDelete={onDelete}
                    question={translate("microgatewayApp.microprojectProject.delete.question", {id: project.label})}
                />
                <ProjectComment
                    open={openComment}
                    project={project}
                    onClose={() => setOpenComment(false)}
                 />
                <ProjectTasksModal
                    project={project}
                    open={openTasks}
                    onClose={() =>{setOpenTasks(false)}}
                    onProjectUpdate={onSave}
                    onTaskDelete={() => handleTaskDeleted()}
                    onUpdate={() => getProgress()}
                    onCreate={() =>{ handleCreatedTask() }} // force adding button display
                />
                <ProjectLogigramModal
                    open={openLogigram}
                    project={project}
                    onClose={() => setOpenLogigram(false)}
                />
               {/*  <ProjectCalendarModal
                    project={project}
                    open={openCalendar}
                    onClose={() => setOpenCalendar(false)}
                 /> */}
                 <ProjectGanttModal
                    project={project}
                    open={openGantt}
                    onClose={() => setOpenGantt(false)}
                 />

                 <MyCustomPureHtmlRenderModal 
                    open={openDesc}
                    body={project.description}
                    title={translate('microgatewayApp.microprojectProject.description')}
                    onClose={() => setOpenDesc(false)}
                 />
                 
                <TreeItem 
                    nodeId={project.id.toString()} 
                    classes={{ content: classes.treeContent }}
                    label={<CardHeader 
                        title={project.label}
                        subheader={
                            <Box width={1} height={1} display="flex" alignItems="center" justifyContent={"center"}>
                                {loading && <Typography variant="h5" color="primary" className="mr-2">loading...</Typography>}
                                {project.description && 
                                    <Tooltip title={translate('entity.action.view')}
                                        onClick={() => setOpenDesc(true)} className="mr-2">
                                        <Button 
                                        variant='text' 
                                        color="primary"
                                        size="small"
                                        endIcon={<Visibility />}
                                        className="text-capitalize p-0"
                                        >
                                            {translate('microgatewayApp.microprojectProject.description')}
                                        </Button>
                                    </Tooltip>
                                }
                                <span className={clsx('badge ml-3 mr-3 badge-pill', {
                                    'badge-secondary': !projectProgressPercent,
                                    'badge-warning': projectProgressPercent && projectProgressPercent <50,
                                    'badge-info' : projectProgressPercent && projectProgressPercent >50 && projectProgressPercent && projectProgressPercent <=70,
                                    'badge-success' : projectProgressPercent && projectProgressPercent > 70,
                                })}>
                                    {loadingProgress ? 'loading...' 
                                        : `${projectProgressPercent ? projectProgressPercent.toFixed(2) : 0}%`}
                                </span>
                                <ChronoVisualizer chronoUtil={chronoUtil} loading={chrnonLoaing} noValidChronoText="" />
                            </Box>
                        }
                        action={<Box display={"flex"} 
                            justifyContent="flex-end" alignItems="center" flexWrap={"wrap"}>
                                <Tooltip title={translate("entity.action.view")}>
                                    <IconButton className={classes.btn} onClick={() =>setOpenComment(true)}>
                                        <FontAwesomeIcon icon={faComment} style={{ fontSize:15, }}/>
                                    </IconButton>
                                </Tooltip>
                                {canUpdate && <>
                                    <Tooltip 
                                        title={translate("entity.action.edit")}
                                         onClick={() => handleUpdate(project)}>
                                        <IconButton className={classes.btn}><Edit /></IconButton>
                                    </Tooltip>
                                    </>
                                }
                                {canCreate &&
                                    <Tooltip title={translate("_global.label.add")} onClick={() => handleUpdate(null)}>
                                        <IconButton className={classes.btn}><Add /></IconButton>
                                    </Tooltip>
                                }
                                <Tooltip onClick={() => setOpenLogigram(true)}
                                    title={translate("_global.logigram.title")}>
                                    <IconButton className={classes.btn}>
                                        <FontAwesomeIcon icon={faSitemap} style={{ fontSize:15, }}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip onClick={() => setOpenTasks(true)}
                                    title={translate("microgatewayApp.microprojectProjectTask.home.title")}>
                                    <IconButton className={classes.btn}>
                                        <Badge color="secondary" badgeContent={nbTasks}><List /></Badge>
                                    </IconButton>
                                </Tooltip>
                                {/* <Tooltip onClick={() => handleOpenCalendar(data)}
                                    title={translate("microgatewayApp.workCalender.detail.title")}>
                                    <IconButton className={classes.btn}>
                                        <FontAwesomeIcon icon={faCalendarDay} style={{ fontSize:16, }}/>
                                    </IconButton>
                                </Tooltip> */}
                                <Tooltip onClick={() => setOpenGantt(true)}
                                    title={"D. Gantt"}>
                                    <IconButton className={classes.btn}>
                                        <FontAwesomeIcon icon={faStream} style={{ fontSize:16, }}/>
                                    </IconButton>
                                </Tooltip>
                                {canDelete ? (
                                    <Tooltip
                                        title={translate("entity.action.delete")}
                                         onClick={handleDelete}>
                                        <IconButton className={classes.deleteBtn}><Delete /></IconButton>
                                    </Tooltip>
                                ):(
                                    <Tooltip
                                        title={translate("entity.action.delete")}
                                         onClick={() =>{}}>
                                        <IconButton className={classes.deleteBtn} disabled><Delete /></IconButton>
                                    </Tooltip>
                                )}
                        </Box>}
                />}
                className={classes.treeGroup}>
                    {[...projects].filter(p => searchFilter(p)).map((p, index) =>(
                        <ProjectTreeItem 
                         key={index} 
                         project={p}
                         account={props.account} 
                         searchTerm={props.searchTerm}
                         onDelete={onDeleteChildren} 
                         onUpdate={onChildrenUpdate}
                         handleReloadProgress={handleUpdateProgress}
                        />
                    ))}
                </TreeItem>
            </>}
            
        </React.Fragment>
    )
}

ProjectTreeItem.defaultProps={
    searchTerm: ''
}

export default ProjectTreeItem;