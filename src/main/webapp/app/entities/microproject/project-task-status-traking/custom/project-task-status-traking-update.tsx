import { faBan, faCheckCircle, faFile, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Badge, Box, Button, Card, CardContent, CardHeader, Checkbox, Chip, CircularProgress, Collapse, FormControlLabel, Grid, IconButton, makeStyles, Modal, Radio, Slide, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { IRootState } from "app/shared/reducers"
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { Alert } from "@material-ui/lab";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { IProjectTaskStatusTraking } from "app/shared/model/microproject/project-task-status-traking.model";
import { ProjectTaskStatus } from "app/shared/model/enumerations/project-task-status.model";
import MyCustomRTEModal from "app/shared/component/my-custom-rte-modal";
import { IProjectEdgeInfo } from "app/shared/model/microproject/project-edge-info.model";
import { IProjectStartableTask } from "app/shared/model/microproject/project-startable-task.model";
import { ProjectStartableTaskCond } from "app/shared/model/enumerations/project-startable-task-cond.model";
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer';
import { FileEntityTag } from "app/shared/model/file-chunk.model";


const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    taskItemBox:{
        cursor: 'pointer',
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover':{
            border: `1px solid ${theme.palette.secondary.main}`,
        }
    },
    justificationCard:{
        width: '44%',
        [theme.breakpoints.down("sm")]:{
            width: '90%',
        },
    },
    startableBockCard:{
        boxShadow: 'none',
        margin: 0,
        padding: 0,
    }
}))

const TaskStartableBlock = (props: {
     startables: IProjectStartableTask[],
     startCond: ProjectStartableTaskCond, 
     enabled: boolean, onEnableChange: Function}) =>{
    
    const { startables, startCond  } = props;

    const classes = useStyles();

    const handleEnableChange = () =>{
        props.onEnableChange(startCond, !props.enabled);
    }
    
    const title = startCond === ProjectStartableTaskCond.LOOPBACK ?
                  translate(`_global.label.loopbackTasks`) : 
                  startCond === ProjectStartableTaskCond.TRIGGER_VALIDATED ?
                   translate(`_global.label.startableValidationTasks`) : '';
    return (
        <React.Fragment>
            {startables && startables.length  !== 0 && <>
                <Card className={classes.startableBockCard}>
                    <CardHeader 
                        title={title}
                        titleTypographyProps={{ color: 'primary' }}
                        subheader={<Box display={"flex"} width={1} flexWrap="wrap"
                         justifyContent="center" alignItems={"center"}>
                             <FormControlLabel 
                                label={translate("_global.label.enabled")}
                                control={<Checkbox color="primary"  checked={props.enabled} onChange={handleEnableChange}/>}
                             />
                         </Box>}
                    />
                    <CardContent>
                        <Box display={"flex"} width={1} flexWrap="wrap"
                         justifyContent="center" >
                             {startables.map((item, index) => (
                                 <Chip key={index} className="m-2" variant="outlined"
                                    label={`${item.startableTaskName}${item.startableProjectName ? '#'+item.startableProjectName: ''}`} />
                             ))}
                         </Box>
                    </CardContent>
                </Card>
            </>}
        </React.Fragment>
    )
}


const TaskItem = (props: {task: IProjectTask, selected?: boolean, onSelect: Function}) =>{
    const {task, selected} = props;

    const classes = useStyles();
    
    const handleSelect = () =>{
        if(selected)
            props.onSelect();
        else
            props.onSelect(task);
    }

    return (
        <React.Fragment>
            {task && <Box m={1} 
                 onClick={handleSelect}
                 boxShadow={5} 
                 borderRadius={15} p={2}
                 display="flex" justifyContent="center" 
                 overflow="auto" flexWrap="wrap"
                flexDirection="column" alignItems="center"
                className={classes.taskItemBox}>
                <Typography>{task.name}</Typography>
                <Radio checked={selected} />
            </Box>}
        </React.Fragment>
    )
}

interface TaskStatusTrakingUpdateProps extends StateProps, DispatchProps{
    open?:boolean,
    title?: string,
    cancelText?: string,
    okText?:string,
    task:IProjectTask,
    traking?:IProjectTaskStatusTraking,
    newStatus:ProjectTaskStatus,
    onChangeStatus?:Function,
    onSavedTraking?: Function,
    onClose:Function,
}


export const ProjectTaskStatusTrakingUpdate = (props: TaskStatusTrakingUpdateProps) =>{
    const { open, account, newStatus, task, title, cancelText, okText } = props;
    const [entity, setEntity] = useState(props.traking || {taskId: task.id});
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [nextTasks, setNextTasks] = useState<IProjectTask[]>([]);
    const [nextTaskToStart, setNextTaskToStart] = useState<IProjectTask>(null);
    const [isReStartingAction, setIsRestartingAction] = useState(false);
    const [findingNextTask, setFindingNextTask] = useState(false);
    const [openFileManager, setOpenFileManager] = useState(false);
    const [openJustif, setOpenJustif] = useState(false);
    const [success, setSuccess] = useState(false);
    const [startableTasks, setStartableTasks] = useState<IProjectStartableTask[]>([]);
    const [startCondsToApply, setStartCondsToApply] = useState<ProjectStartableTaskCond[]>([]);

    const isDynamicTrack = task && task.status && newStatus && task.status !== newStatus;

    const fileTag = FileEntityTag.projectTaskStatusTraking;
    
    const checkIsRestatingAction = ()  =>{
        if(task && newStatus === ProjectTaskStatus.STARTED){
            if(task.status !== ProjectTaskStatus.VALID){
                setIsRestartingAction(true);
            }else{
                axios.get<IProjectTaskStatusTraking[]>(`${API_URIS.projectTaskStatusTrakingApiUri}/?page=${0}&size=${10}&sort=id,desc`)
                    .then(res =>{
                        if(res.data && [...res.data].some(item => item.status !== ProjectTaskStatus.VALID))
                            setIsRestartingAction(true);
                        else
                            setIsRestartingAction(false);
                    }).catch(e =>{
                        setIsRestartingAction(false)
                    })
            }
        }
    }

    const getFiles = () =>{
        if(entity && entity.id){
            getMshzFileByEntityIdAndEntityTag(entity.id, fileTag)
                .then(res =>setFiles([...files, ...res.data]))
                .catch(e => console.log(e))
        }else{
            setFiles([])
        }
    }

    const findingTasksLinkedFromConds = (conds?: IProjectEdgeInfo[]) =>{
        if(conds && conds.length !== 0){
            setFindingNextTask(true)
            let apiUri = `${API_URIS.edgeInfoApiUri}/?source.in=${conds.map(cnd => cnd.target).join(",")}`;
            apiUri = `${apiUri}&processId.equals=${task.processId}`;
            axios.get<IProjectEdgeInfo[]>(apiUri)
                .then(res =>{
                    const condNodes = [...res.data].filter(item => item.target && item.target.includes("cond"));
                    const taskNodes =  [...res.data].filter(item => item.target && !item.target.includes("cond"));
                    if(taskNodes && taskNodes.length !== 0){
                        setFindingNextTask(true)
                        apiUri = `${API_URIS.projectTaskApiUri}/?id.in=${taskNodes.map(tn => Number(tn.target)).join(',')}`;
                        apiUri = `${apiUri}&processId.equals=${task.processId}`;
                        axios.get<IProjectTask[]>(apiUri)
                        .then(result =>{
                            if(![...result.data].some(t => t.status !== ProjectTaskStatus.VALID && t.status !== ProjectTaskStatus.ON_PAUSE))
                                setNextTasks([...nextTasks, ...result.data]);
                        }).catch(e => console.log(e))
                        .finally(() => setFindingNextTask(false))
                    }
                    
                    if(condNodes && condNodes.length !==0)
                        findingTasksLinkedFromConds(condNodes);

                }).catch(e => console.log(e))
                .finally(() => setFindingNextTask(false))
        }
    }

    const findNextTasks = () =>{
        setNextTasks([]);
        if(task && task.id && newStatus && (newStatus === ProjectTaskStatus.CANCELED || newStatus === ProjectTaskStatus.COMPLETED)){
            setFindingNextTask(true)
            // source cond node if is exists
            let apiUri = `${API_URIS.projectEdgeInfoApiUri}/?source.equals=${task.id.toString()}`;
            apiUri = `${apiUri}&processId.equals=${task.processId}`;
            axios.get<IProjectEdgeInfo[]>(apiUri)
                .then(res =>{
                    const condNodes = [...res.data].filter(item => item.target && item.target.includes("cond"));
                    if(condNodes && condNodes.length !==0)
                        findingTasksLinkedFromConds(condNodes);
                    else
                        setNextTasks([]);
                }).catch(e => {
                    console.log(e);
                    setNextTasks([]);
                }).finally(() => setFindingNextTask(false))
        }
    }

    const getStartableTasks = () =>{
        if(props.task && props.task.id){
            setLoading(true)
            axios.get<IProjectStartableTask[]>(`${API_URIS.projectStartableTasksApiUri}/?triggerTaskId.equals=${props.task.id}&page=0&size=1000`)
            .then(res =>{ setStartableTasks(res.data)}).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }


    useEffect(() =>{
        checkIsRestatingAction();
        findNextTasks();
        getFiles();
        getStartableTasks();
    }, [props.task, props.newStatus])

    const classes = useStyles();

    const handleClose = () => {
        setSuccess(false);
        props.onClose();
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setEntity({...entity, [name]: value});
    }

    const handleNextTaskSelect = (selected?: IProjectTask) =>{
        setNextTaskToStart(selected);
    }

    const items = [...nextTasks].map(t =><TaskItem key={t.id} task={t} 
                selected={nextTaskToStart && nextTaskToStart.id === t.id} 
                onSelect={handleNextTaskSelect}/>)

    const handleUploadedFiles = (uploaded?: IMshzFile[]) =>{
        if(uploaded && uploaded.length !==0){
            setFiles([...files, ...uploaded]);
        }
    }

    const lunchNextTask = () =>{
        if(nextTaskToStart && (nextTaskToStart.status === ProjectTaskStatus.VALID || nextTaskToStart.status === ProjectTaskStatus.ON_PAUSE)){
            setLoading(true)
            setLoading(true)
            let requestUri = `${API_URIS.projectTaskApiUri}`;
            if(nextTaskToStart.status === ProjectTaskStatus.VALID)
                requestUri = `${requestUri}/start`;
            else
                requestUri = `${requestUri}/play`;
            axios.put<IProjectTask>(`${API_URIS.projectTaskApiUri}/start`, cleanEntity(nextTaskToStart))
                .then((res) =>{
                    /* if(props.onChangeStatus)
                        props.onChangeStatus(res.data); */
                 }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    const startStartables = () =>{
        if(props.task && props.task.id && startCondsToApply && startCondsToApply.length !== 0){
            let apiUri = `${API_URIS.projectTaskApiUri}/startByTaskIdAndConds/${props.task.id}`;
            apiUri = `${apiUri}/?conds=${startCondsToApply.map(s => s.toString()).join(',')}`
            axios.get(apiUri)
            .then(() =>{})
            .catch(e => console.log(e))
            .finally(() => {})
        }
    }

    const saveHistoryFiles = (traking?: IProjectTaskStatusTraking) =>{
        if(traking && traking.id){
            if(account){
                props.setFileUploadWillAssociateEntityId(account.id)
                props.associateFilesToEntity(traking.id, fileTag.toString(), account.id);
            }

            setLoading(false)
            if(props.onSavedTraking)
                props.onSavedTraking(traking, true);
        }
    }

    const saveHistory = () =>{
        const history: IProjectTaskStatusTraking = {
            ...entity, 
            taskId: task.id,
            status: newStatus,
            userId: account ? account.id : null,
            tracingAt: (new Date()).toISOString(),
            editable: !isDynamicTrack
        }
        setLoading(true)
        axios.post<IProjectTaskStatusTraking>(API_URIS.projectTaskStatusTrakingApiUri, cleanEntity(history))
            .then(res =>{
                if(res && res.data){
                    saveHistoryFiles(res.data);
                }
            }).catch(e => console.log(e))
                .finally(() => setLoading(false))
    }

    const changeTaskSatus = (event) =>{
        event.preventDefault();
        if(task){
            if(isDynamicTrack){
                let requestUri = `${API_URIS.projectTaskApiUri}`;
                if(newStatus === ProjectTaskStatus.COMPLETED)
                    requestUri = `${requestUri}/finish`;
                else if(newStatus === ProjectTaskStatus.CANCELED)
                    requestUri = `${requestUri}/cancel`;
                else if(newStatus === ProjectTaskStatus.STARTED && task.status === ProjectTaskStatus.ON_PAUSE)
                    requestUri = `${requestUri}/play`;
                else if(newStatus === ProjectTaskStatus.STARTED && task.status !== ProjectTaskStatus.ON_PAUSE)
                    requestUri = `${requestUri}/start`;
                else if(newStatus === ProjectTaskStatus.SUBMITTED)
                    requestUri = `${requestUri}/submit`;
                else if(newStatus === ProjectTaskStatus.ON_PAUSE)
                    requestUri = `${requestUri}/pause`;
                else if(newStatus === ProjectTaskStatus.EXECUTED)
                    requestUri = `${requestUri}/execute`;
                else
                    requestUri = null;
                if(requestUri){
                    setLoading(true)
                    axios.put<IProjectTask>(requestUri, cleanEntity(task))
                        .then(res =>{
                            if(res.data){
                                setSuccess(true);
                                if(props.onChangeStatus){
                                    props.onChangeStatus(res.data);
                                }
                                lunchNextTask();
                                startStartables();
                                saveHistory();
                            }
                        }).catch(e => console.log(e))
                        .finally(() => setLoading(false))
                }
            }else{
                saveHistory();
            }
        }
    }

    const handleEnaleStartCondChange = (cond: ProjectStartableTaskCond, enabled?: boolean) =>{
        if(cond){
            if(enabled)
                setStartCondsToApply([...startCondsToApply, cond])
            else
                setStartCondsToApply([...startCondsToApply].filter(sc => sc !== cond));
        }
    }


    return (
        <React.Fragment>
            <ModalFileManager
                open={openFileManager}
                files={[...files]}
                entityId={entity ? entity.id : null}
                entityTagName={fileTag}
                selectMultiple
                onClose={() => setOpenFileManager(false)}
                onSave={handleUploadedFiles}
                title={`${translate("_global.label.files")} ${translate("_global.label.of")} ${translate("microgatewayApp.microprocessTaskStatusTraking.justification")}`}
             /> 
              {entity && 
                <MyCustomRTEModal 
                    open={openJustif}
                    cardClassName={classes.justificationCard}
                    title={translate("microgatewayApp.microprocessTaskStatusTraking.justification")}
                    content={entity.justification}
                    onClose={() =>{setOpenJustif(false)}}
                    editorMinHeight={350}
                    onSave={value =>{ 
                        setOpenJustif(false); 
                        setEntity({...entity, justification: value}) 
                    }}
                />
             }
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <React.Fragment>
                    <Slide
                            in={open}
                            direction='down'
                        >
                        <Card className={classes.card}>
                            <CardHeader 
                                title={title || "Confirmation"}
                                titleTypographyProps={{ variant: 'h4' }}
                                action={
                                props.onClose ? 
                                <IconButton color="inherit" onClick={handleClose}>
                                    <Close />
                                </IconButton>: ''}
                                className={classes.cardheader}
                            />
                            <CardContent className={classes.cardcontent}>
                                {task && <>
                                {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center"
                                    flexWrap="wrap" overflow="auto" p={2}>
                                        <CircularProgress style={{ width:50, height:50 }}/> <Typography className="ml-3">Loading...</Typography>
                                    </Box>}
                                {(!loading && success) && <Box width={1}>
                                    <Collapse in={open}>
                                        <Alert severity="success"
                                            action={
                                                <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                  setSuccess(false);
                                                }}
                                              >
                                                <Close fontSize="inherit" />
                                              </IconButton>}
                                         >
                                             {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                                        </Alert>
                                    </Collapse>
                                </Box>}
                                <Box width={1} textAlign="center" 
                                    overflow="auto" flexWrap="wrap"
                                    textOverflow="text-wrap" boxShadow={1} p={1}>
                                        <Typography variant="h4">
                                            {isDynamicTrack ? <>
                                                {newStatus === ProjectTaskStatus.CANCELED && translate("_global.label.cancellingTask", {name: `" ${task.name} "`})}
                                                {newStatus === ProjectTaskStatus.ON_PAUSE && translate("_global.label.pausingTask", {name: `" ${task.name} "`})}
                                                {newStatus === ProjectTaskStatus.EXECUTED && translate("_global.label.executingTask", {name: `" ${task.name} "`})}
                                                {newStatus === ProjectTaskStatus.SUBMITTED && translate("_global.label.submittingTask", {name: `" ${task.name} "`})}
                                                {(newStatus === ProjectTaskStatus.STARTED && isReStartingAction) && translate("_global.label.restartingTask", {name: `" ${task.name} "`})}
                                                {(newStatus === ProjectTaskStatus.STARTED && !isReStartingAction) && translate("_global.label.startingTask", {name: `" ${task.name} "`})}
                                                {newStatus === ProjectTaskStatus.COMPLETED && translate("_global.label.completingTask", {name: `" ${task.name} "`})}
                                            </> : translate("microgatewayApp.microprocessTaskStatusTraking.home.createOrEditLabel")
                                            }
                                        </Typography>
                                </Box>
                                {isDynamicTrack &&
                                    <Box width={1} mt={2} mb={2} boxShadow={2} p={2} pt={1}>
                                    <Typography variant="h4" className="mb-3 text-primary">
                                        {translate("_global.label.condinedTasks")}
                                    </Typography>
                                    {findingNextTask && <Box width={1} display="flex" justifyContent="center"
                                        alignItems="center" overflow="hidden" flexWrap="wrap">
                                            <CircularProgress style={{ width: 20, height:20 }}
                                             color="primary"/>
                                             <Typography variant="caption" className="text-primary ml-3">
                                                 {translate("_global.label.searching")+'...'}
                                             </Typography>
                                    </Box>}
                                    <Box width={1} mt={1} display="flex" justifyContent="center"
                                        alignItems="center" flexWrap="wrap" overflow="auto">
                                            {!findingNextTask && [...nextTasks].length === 0 && <Box width={1} mb={1} textAlign="center">
                                                <Typography variant="caption">{translate("microgatewayApp.microprocessTask.home.notFound")}</Typography>
                                            </Box>
                                            }
                                            {([...nextTasks].length !== 0 && !nextTaskToStart) && <Box width={1} mb={1} textAlign="center">
                                                <Typography variant="caption">{translate('_global.label.clickOnTaskToSelectIt')}</Typography>
                                            </Box>}
                                            {items}
                                        </Box>
                                </Box>}
                                {newStatus === ProjectTaskStatus.COMPLETED && <>
                                    {[...startableTasks].filter(st => st.startCond === ProjectStartableTaskCond.LOOPBACK).length !== 0 &&
                                        <Box width={1} mt={2} mb={2} boxShadow={2} p={2} pt={1}>
                                            <TaskStartableBlock  
                                                startables={[...startableTasks].filter(st => st.startCond === ProjectStartableTaskCond.LOOPBACK)}
                                                startCond={ProjectStartableTaskCond.LOOPBACK}
                                                enabled={[...startCondsToApply].some(cond => cond === ProjectStartableTaskCond.LOOPBACK)}
                                                onEnableChange={handleEnaleStartCondChange}
                                            />
                                        </Box> 
                                    }
                                    {[...startableTasks].filter(st => st.startCond === ProjectStartableTaskCond.TRIGGER_VALIDATED).length !== 0 &&
                                        <Box width={1} mt={2} mb={2} boxShadow={2} p={2} pt={1}>
                                            <TaskStartableBlock  
                                                startables={[...startableTasks].filter(st => st.startCond === ProjectStartableTaskCond.TRIGGER_VALIDATED)}
                                                startCond={ProjectStartableTaskCond.TRIGGER_VALIDATED}
                                                enabled={[...startCondsToApply].some(cond => cond === ProjectStartableTaskCond.TRIGGER_VALIDATED)}
                                                onEnableChange={handleEnaleStartCondChange}
                                            />
                                        </Box> 
                                    } 
                                </>}
                                <Box width={1} mt={2} mb={2} boxShadow={2} p={2} pt={1}>
                                    <Typography variant="h4" className="text-primary mb-3">
                                        {translate("microgatewayApp.microprocessTaskStatusTraking.justification")}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box width={1} display="flex" 
                                                justifyContent="center" alignItems="center" flexWrap="wrap">
                                                    <Button
                                                        color="primary" 
                                                        className="text-capitalize mr-3"
                                                        endIcon={<FontAwesomeIcon icon={faPen} />}
                                                        onClick={() => setOpenJustif(true)}>
                                                        Text
                                                    </Button>
                                                    <Button
                                                        color="inherit"
                                                        className="text-capitalize"
                                                        endIcon={
                                                        <Badge badgeContent={[...files].length} 
                                                                color="secondary"
                                                                showZero={true}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'right',
                                                                }}
                                                            > 
                                                                <FontAwesomeIcon icon={faFile} />
                                                            </Badge>
                                                        }
                                                        onClick={() => setOpenFileManager(true)}>
                                                        {translate("_global.label.files")}
                                                    </Button>
                                                </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box display="flex" flexWrap="wrap" overflow="auto" 
                                            justifyContent="center" alignItems="center" mt={5}>
                                        {isDynamicTrack && <Button 
                                            color="default"
                                            variant="text"
                                            className="text-capitalize"
                                            onClick={handleClose}>
                                                <Typography className="mr-2">{cancelText || translate("_global.label.cancel")}</Typography>
                                                <FontAwesomeIcon icon={faBan} />
                                        </Button>}
                                        <Button 
                                            color="primary"
                                            variant="text"
                                            disabled={success || findingNextTask}
                                            onClick={changeTaskSatus}
                                            className="ml-5 text-capitalize">
                                                <Typography className="mr-2">
                                                    {isDynamicTrack ? `${okText || translate("_global.label.confirm")}` : translate("entity.action.save")}
                                                </Typography>
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                        </Button>
                                    </Box>
                                    </>}
                            </CardContent>
                        </Card>
                    </Slide>
                </React.Fragment>
            </Modal>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication }:IRootState) =>({
    account: authentication.account,
})

const mapDispatchToProps = {
    associateFilesToEntity, 
    setFileUploadWillAssociateEntityId
}

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskStatusTrakingUpdate);
