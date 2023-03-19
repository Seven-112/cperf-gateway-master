import { faBan, faCheckCircle, faFile, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Badge, Box, Button, Card, CardContent, CardHeader, CircularProgress, Collapse, FormControlLabel, Grid, IconButton, makeStyles, Modal, Radio, Slide, Switch, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";
import { ITaskStatusTraking } from "app/shared/model/microprocess/task-status-traking.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import { IRootState } from "app/shared/reducers"
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import { IEdgeInfo } from "app/shared/model/microprocess/edge-info.model";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { Alert } from "@material-ui/lab";
import MyCustomRTEModal from "app/shared/component/my-custom-rte-modal";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer';

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
    }
}))

const TaskItem = (props: {task: ITask, selected?: boolean, onSelect: Function}) =>{
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
    task:ITask,
    triggerTaskId?: any,
    traking?:ITaskStatusTraking,
    newStatus:TaskStatus,
    onChangeStatus?:Function,
    onSavedTraking?: Function,
    onClose:Function,
}

export const TaskStatusTrakingUpdate = (props: TaskStatusTrakingUpdateProps) =>{
    const { open, account, newStatus, title, cancelText, okText, triggerTaskId } = props;
    const [entity, setEntity] = useState(props.traking || {taskId: props.task ? props.task.id : null});
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState(props.task);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [nextTasks, setNextTasks] = useState<ITask[]>([]);
    const [nextTaskToStart, setNextTaskToStart] = useState<ITask>(null);
    const [isReStartingAction, setIsRestartingAction] = useState(false);
    const [findingNextTask, setFindingNextTask] = useState(false);
    const [openFileManager, setOpenFileManager] = useState(false);
    const [openJustif, setOpenJustif] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cancelProcess, setCancelProcess] = useState(false);

    const isDynamicTrack = task && task.status && newStatus && task.status !== newStatus;

    const fileTag = FileEntityTag.processTaskStatusTraking;
    
    const checkIsRestatingAction = ()  =>{
        if(task && newStatus === TaskStatus.STARTED){
            if(task.status !== TaskStatus.VALID){
                setIsRestartingAction(true);
            }else{
                axios.get<ITaskStatusTraking[]>(`${API_URIS.taskStatusTrakingApiUri}/?page=${0}&size=${10}&sort=id,desc`)
                    .then(res =>{
                        if(res.data && [...res.data].some(item => item.status !== TaskStatus.VALID))
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
            getMshzFileByEntityIdAndEntityTag(entity.id,fileTag)
                .then(res =>{
                    if(res.data){
                        setFiles([...files, ...res.data]);
                    }
                }).catch(e => console.log(e))
        }else{
            setFiles([])
        }
    }

    const findingTasksLinkedFormConds = (conds?: IEdgeInfo[]) =>{
        if(conds && conds.length !== 0){
            setFindingNextTask(true)
            let apiUri = `${API_URIS.edgeInfoApiUri}/?source.in=${conds.map(cnd => cnd.target).join(",")}`;
            apiUri = `${apiUri}&processId.equals=${task.processId}`;
            axios.get<IEdgeInfo[]>(apiUri)
                .then(res =>{
                    const condNodes = [...res.data].filter(item => item.target && item.target.includes("cond"));
                    const taskNodes =  [...res.data].filter(item => item.target && !item.target.includes("cond"));
                    if(taskNodes && taskNodes.length !== 0){
                        setFindingNextTask(true)
                        apiUri = `${API_URIS.taskApiUri}/?id.in=${taskNodes.map(tn => Number(tn.target)).join(',')}`;
                        apiUri = `${apiUri}&processId.equals=${task.processId}`;
                        axios.get<ITask[]>(apiUri)
                        .then(result =>{
                            if(![...result.data].some(t => t.status !== TaskStatus.VALID && t.status !== TaskStatus.ON_PAUSE))
                                setNextTasks([...nextTasks, ...result.data]);
                        }).catch(e => console.log(e))
                        .finally(() => setFindingNextTask(false))
                    }
                    
                    if(condNodes && condNodes.length !==0)
                        findingTasksLinkedFormConds(condNodes);

                }).catch(e => console.log(e))
                .finally(() => setFindingNextTask(false))
        }
    }

    const findNextTasks = () =>{
        setNextTasks([]);
        if(task && task.id && newStatus && (newStatus === TaskStatus.CANCELED || newStatus === TaskStatus.COMPLETED)){
            setFindingNextTask(true)
            // source cond node if is exists
            let apiUri = `${API_URIS.edgeInfoApiUri}/?source.equals=${task.id.toString()}`;
            apiUri = `${apiUri}&processId.equals=${task.processId}`;
            axios.get<IEdgeInfo[]>(apiUri)
                .then(res =>{
                    const condNodes = [...res.data].filter(item => item.target && item.target.includes("cond"));
                    if(condNodes && condNodes.length !==0)
                        findingTasksLinkedFormConds(condNodes);
                    else
                        setNextTasks([]);
                }).catch(e => {
                    console.log(e);
                    setNextTasks([]);
                }).finally(() => setFindingNextTask(false))
        }
    }


    useEffect(() =>{
        checkIsRestatingAction();
        findNextTasks();
        getFiles();
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

    const handleNextTaskSelect = (selected?: ITask) =>{
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
        if(nextTaskToStart && (nextTaskToStart.status === TaskStatus.VALID || nextTaskToStart.status === TaskStatus.ON_PAUSE)){
            setLoading(true)
            setLoading(true)
            let requestUri = `${API_URIS.taskApiUri}`;
            if(nextTaskToStart.status === TaskStatus.VALID)
                requestUri = `${requestUri}/start`;
            else
                requestUri = `${requestUri}/play`;
            axios.put<ITask>(`${API_URIS.taskApiUri}/start`, cleanEntity(nextTaskToStart))
                .then((res) =>{
                    /* if(props.onChangeStatus)
                        props.onChangeStatus(res.data); */
                 }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    const saveHistoryFiles = (traking?: ITaskStatusTraking) =>{
        if(traking && traking.id){
            if(account){
                props.setFileUploadWillAssociateEntityId(traking.id);
                props.associateFilesToEntity(traking.id, fileTag.toString(), account.id);
            }
            if(props.onSavedTraking)
                props.onSavedTraking(traking, true);
        }
    }

    const saveHistory = () =>{
        const history: ITaskStatusTraking = {
            ...entity, 
            taskId: task.id,
            status: newStatus,
            userId: account ? account.id : null,
            tracingAt: (new Date()).toISOString(),
            editable: !isDynamicTrack
        }
        setLoading(true)
        axios.post<ITaskStatusTraking>(API_URIS.taskStatusTrakingApiUri, cleanEntity(history))
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
                let requestUri = `${API_URIS.taskApiUri}`;
                if(newStatus === TaskStatus.COMPLETED)
                    requestUri = `${requestUri}/finish`;
                else if(newStatus === TaskStatus.CANCELED)
                    requestUri = `${requestUri}/cancel?cancelProcess=${cancelProcess}`;
                else if(newStatus === TaskStatus.STARTED && task.status === TaskStatus.ON_PAUSE)
                    requestUri = `${requestUri}/play`;
                else if(newStatus === TaskStatus.STARTED && task.status !== TaskStatus.ON_PAUSE)
                    requestUri = `${requestUri}/start`;
                else if(newStatus === TaskStatus.SUBMITTED)
                    requestUri = `${requestUri}/submit`;
                else if(newStatus === TaskStatus.ON_PAUSE)
                    requestUri = `${requestUri}/pause`;
                else if(newStatus === TaskStatus.EXECUTED)
                    requestUri = `${requestUri}/execute`;
                else if(newStatus === TaskStatus.VALID)
                    requestUri = `${requestUri}/reset`;
                else
                    requestUri = null;
                if(requestUri){
                    if(triggerTaskId)
                        requestUri=`${requestUri}?triggerTaskId=${triggerTaskId}`;
                    setLoading(true)
                    axios.put<ITask>(requestUri, cleanEntity(task))
                        .then(res =>{
                            if(res.data){
                                setSuccess(true);
                                if(props.onChangeStatus){
                                    props.onChangeStatus(res.data);
                                }
                                lunchNextTask();
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

    useEffect(() =>{
        setTask(props.task);
        setEntity(props.traking || {taskId: props.task ? props.task.id : null})
    }, [props.task])

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
                                                {newStatus === TaskStatus.CANCELED && translate("_global.label.cancellingTask", {name: `" ${task.name} "`})}
                                                {newStatus === TaskStatus.ON_PAUSE && translate("_global.label.pausingTask", {name: `" ${task.name} "`})}
                                                {newStatus === TaskStatus.EXECUTED && translate("_global.label.executingTask", {name: `" ${task.name} "`})}
                                                {newStatus === TaskStatus.SUBMITTED && translate("_global.label.submittingTask", {name: `" ${task.name} "`})}
                                                {(newStatus === TaskStatus.STARTED && isReStartingAction) && translate("_global.label.restartingTask", {name: `" ${task.name} "`})}
                                                {(newStatus === TaskStatus.STARTED && !isReStartingAction) && translate("_global.label.startingTask", {name: `" ${task.name} "`})}
                                                {newStatus === TaskStatus.COMPLETED && translate("_global.label.completingTask", {name: `" ${task.name} "`})}
                                                {newStatus === TaskStatus.VALID && translate("_global.label.resetingTask", {name: `" ${task.name} "`})}
                                            </> : translate("microgatewayApp.microprocessTaskStatusTraking.home.createOrEditLabel")
                                            }
                                        </Typography>
                                        {newStatus === TaskStatus.CANCELED && <Box  width={1} mt={1} 
                                            display="flex" justifyContent={"center"} alignItems="baseline" flexWrap="wrap">
                                            <Typography className="mr-2" color="primary">
                                                {translate("_global.label.cancelTaskAndProcessQuestion")}
                                            </Typography>
                                            <FormControlLabel 
                                                control={<Switch checked={cancelProcess} 
                                                color="primary" onChange={() => setCancelProcess(!cancelProcess)} />}
                                                label={<Typography color="primary">{translate(`_global.label.${cancelProcess ? 'yes': 'no'}`)}</Typography>}
                                            />
                                        </Box>}
                                </Box>
                                {(isDynamicTrack && !cancelProcess && newStatus !== TaskStatus.VALID) &&
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskStatusTrakingUpdate);
