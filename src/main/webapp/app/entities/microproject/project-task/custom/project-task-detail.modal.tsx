
import React, { useEffect, useState } from 'react';
import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, colors, FormControl, Grid, IconButton, makeStyles, Modal, TextField, Typography } from '@material-ui/core';
import { IEmployee } from 'app/shared/model/employee.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import CloseIcon from '@material-ui/icons/Close';
import { IDepartment } from 'app/shared/model/department.model';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import TaskChrono from './project-task-chrono';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import {ProjectTaskControl} from './project-tak-control';
import { IProjectTask } from 'app/shared/model/microproject/project-task.model';
import { IProjectTaskUser } from 'app/shared/model/microproject/project-task-user.model';
import { ProjectTaskUserRole } from 'app/shared/model/enumerations/project-task-user-role.model';
import { IProject } from 'app/shared/model/microproject/project.model';
import ProjectTaskDetailToolbar from './project-task-detail-toolbar';
import { TASK_START_MODE } from 'app/entities/microprocess/task/custom/task-update';
import { formateDate } from 'app/shared/util/date-utils';

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        background: "transparent",
        boxShadow: 'none',
        marginTop:theme.spacing(5),
        width: '55%',
        [theme.breakpoints.down('sm')]:{
            width: '80%',
        }
    },
    cardHeader:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        borderRadius: '25px 25px 0 0',
    },
    subheader:{
        display: 'flex',
        justifyContent: 'center',
        color: colors.blueGrey[100],
    },
    toolbar:{
        background:theme.palette.primary.dark,
        color: theme.palette.background.paper,
        margin: theme.spacing(-2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        borderColor: theme.palette.primary.light,
    },
    cardContent:{
        backgroundColor: theme.palette.background.paper,
        maxHeight: theme.spacing(65),
        overflow: 'auto',
    },
    cardActions:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        borderRadius: '0 0 25px 25px',
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
    },
}))

export interface IProjectTaskDetailModalProps extends StateProps, DispatchProps{
    taskId: any,
    open: boolean,
    onUpdate?: Function,
    onClose: Function, // necessary if this component called in modal
    onCheckiListChange?: Function,
}

export const ProjectTaskDetailModal = (props: IProjectTaskDetailModalProps) =>{

    const [task, setTask] = useState<IProjectTask>({});

    const [project, setProject] = useState<IProject>(null);
    
    const [loading, setLoading] = useState(false);

    const [group, setGroup] = useState<IDepartment>(null);

    const [taskUserRoles, setTaskUserRoles] = useState<ProjectTaskUserRole[]>([]);
    const [realodControls, setRealoadControls] = useState(false);

    const [sheduledOn, setSheduledOn] = useState(new Date());

    const initTializeSheduledOn = () =>{
        if(task && task.sheduledStartAt){
        const date = new Date(task.sheduledStartAt);
            date.setHours(task.sheduledStartHour || 0);
            date.setMinutes(task.sheduledStartMinute || 0);
            setSheduledOn(date);
        }
    }

    const getTask = () =>{
        setLoading(true);
        axios.get<IProjectTask>(`${API_URIS.projectTaskApiUri}/${props.taskId}`)
            .then(res =>{
                setTask(res.data);
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{
                setLoading(false);
            })
    }

    const getProject = () =>{
        if(task && task.id){
            setLoading(true);
            axios.get<IProject>(`${API_URIS.projectApiUri}/${task.processId}`)
                .then(res =>{
                    setProject(res.data);
                }).catch(e =>{
                    /* eslint-disable no-console */
                    console.log(e);
                }).finally(() =>{
                    setLoading(false);
                })
        }
    }

    const getDepartment = () =>{
        if(task && task.groupId){
            setLoading(true);
            axios.get<IDepartment>(`${API_URIS.depatartmentApiUri}/${task.groupId}`)
                .then(res =>{
                        setGroup(res.data);
                }).catch(e =>{
                    /* eslint-disable no-console */
                    console.log(e);
                }).finally(() =>{
                    setLoading(false);
                })
        }
    }

    const getUserExtraAndTaskUserRoles = () =>{
        if(task && task.id){
            axios.get<IProjectTaskUser[]>(`${API_URIS.projectTaskUserApiUri}/?taskId.equals=${task.id}&userId.equals=${props.account.id}&page=${0}&size=${1000}`)
            .then(res =>{
                if(res.data && res.data.length)
                    setTaskUserRoles([...res.data.map(item => item.role)]);
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            })
        }
    }

    const userDepartmentEqualsTaskGroup = () =>{
        if(task && task.groupId && props.account && props.account.id){
            axios.get<IEmployee>(`${API_URIS.employeeApiUri}/${props.account.id}`)
            .then(res =>{
                if(res.data){
                    if(res.data.department && res.data.department.id === task.groupId)
                        setTaskUserRoles([...taskUserRoles, ProjectTaskUserRole.EXCEUTOR]);
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            })
        }
    }

    useEffect(() =>{
        getSession();
    }, [])

    useEffect(() =>{
        getUserExtraAndTaskUserRoles();
    }, [props.account])

    useEffect(() =>{
        if(props.open)
            getTask();
    }, [props.taskId, props.open]);

    useEffect(() =>{
        getProject();
        getDepartment();
        userDepartmentEqualsTaskGroup();
        initTializeSheduledOn();
    }, [task]);

    const handleClose = () =>{
        if(props.onClose){
            props.onClose();
        }
    }

    const handleUpdate = (updated?: IProjectTask) =>{
        if(updated){
            if(props.onUpdate)
                props.onUpdate(updated)
            setTask(updated);
        }
    }
    
    const handleCheckListChange = () =>{
        setRealoadControls(!realodControls)
        if(props.onCheckiListChange)
            props.onCheckiListChange();
    }
    
    const isUserExecutor =  taskUserRoles && taskUserRoles.length > 0 && taskUserRoles.some(item =>item === ProjectTaskUserRole.EXCEUTOR);
    const isUserSubmitor =  taskUserRoles && taskUserRoles.length > 0 && taskUserRoles.some(item =>item === ProjectTaskUserRole.SUBMITOR);
    const isUserValidor =  taskUserRoles && taskUserRoles.length > 0 && taskUserRoles.some(item =>item === ProjectTaskUserRole.VALIDATOR);

    const startMode = task ? task.sheduledStartAt ? TASK_START_MODE.ON_FIXED_DATE 
        : task.startWithProcess ?
          TASK_START_MODE.WITH_PROCESS : TASK_START_MODE.AFTER_PREVIEW 
        : TASK_START_MODE.WITH_PROCESS

    const classes = useStyles();

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
                <Card classes={{ root: classes.card }}>
                    <CardHeader classes={{ root: classes.cardHeader, subheader: classes.subheader }}
                    title={<Box display="flex" alignItems="center">
                         <FontAwesomeIcon icon={faThumbtack} />
                        <Typography variant="h4" className="ml-2">
                            {`${translate('microgatewayApp.microprocessTask.detail.title')} : ${ task ? task.name : ''}`}
                        </Typography>
                    </Box>
                    }
                    action={
                        <React.Fragment>
                                <IconButton onClick={handleClose} color="inherit">
                                    <CloseIcon />
                                </IconButton>
                        </React.Fragment>
                    }
                    />
                    <CardContent classes={{ root: classes.cardContent }}>
                        <Box className={classes.toolbar}>
                            <ProjectTaskDetailToolbar
                             task={task} 
                             executor={isUserExecutor}
                             submitor={isUserSubmitor}
                             validor={isUserValidor}
                             onTaskUpdate={(updated, isNew) =>handleUpdate(updated)} 
                             onCheckListChane={handleCheckListChange} />
                        </Box>
                        <Box width={1} p={1}>
                                <Grid container spacing={1}>
                                    {project && project.valid && 
                                    <Grid item xs={12}>
                                        <Box width={1} display="flex" justifyContent="center">
                                            <div className="d-inline-block ml-2" style={{ marginTop: '-5px', }}>
                                                <TaskChrono task={task} blankText="" hideActionButton={true} onPlayOrPause={handleUpdate}/>
                                            </div>
                                            <div className="d-inline-block ml-2" style={{ marginTop: '-7px', }}>
                                                <ProjectTaskControl
                                                    account={props.account} 
                                                    task={task} onUpdate={handleUpdate}
                                                    iconProps={{ icon: null, size: 'xs'}} 
                                                    withPlayOrPauseBtn
                                                    withManualModalRestBtn
                                                    realod={realodControls}
                                                    toolTipProps={{ title: "", placement: "left", children: null, }}
                                                    />
                                            </div>
                                        </Box>
                                    </Grid>}
                                    <Grid item xs={12} md={12}>
                                            <FormControl fullWidth>
                                                <TextField type="text" name="name"
                                                    variant="standard" size="small"
                                                    value={task.name}
                                                    label={translate('microgatewayApp.microprocessTask.name')+ ' : '}
                                                    InputLabelProps={{ shrink: true }}/>
                                            </FormControl>
                                    </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                            <TextField type="text" name="groupId" 
                                                value={group ? group.name : ''}
                                                label={translate('microgatewayApp.microprocessTask.groupId')}
                                                InputLabelProps={{ shrink: true }}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                            <TextField type="text" name="description" 
                                                value={task.type}
                                                label={translate('microgatewayApp.microprocessTask.type')}
                                                InputLabelProps={{ shrink: true }}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                            <TextField type="text" name="ponderation" 
                                                value={task.ponderation || 1}
                                                label={translate('microgatewayApp.microprojectProjectTask.ponderation')}
                                                InputLabelProps={{ shrink: true }}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                            <TextField type="text" name="description" 
                                                value={translate(`microgatewayApp.TaskStatus.${task.status ? task.status.toString() : 'null'}`)}
                                                label={translate('_global.form.selectOptions.taskSection.initState')}
                                                InputLabelProps={{ shrink: true }} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                            <TextField type="text"
                                                value={startMode ===TASK_START_MODE.WITH_PROCESS ? 
                                                        translate("_global.form.selectOptions.taskSection.startWithProcessesOpt") :
                                                        startMode === TASK_START_MODE.AFTER_PREVIEW ?
                                                            translate("_global.form.selectOptions.taskSection.noStartWithProcessOpt")
                                                        : formateDate(sheduledOn, `DD/MM/YYYY ${translate("_global.label.to")} HH:mm`)
                                                     }
                                                label={translate('_global.form.selectOptions.taskSection.startWithProcessSelectLabel')} 
                                                InputLabelProps={{ shrink: true }} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h5" align="center" color="primary"
                                                style={{marginBottom:12, }}>
                                                {translate('_global.form.selectOptions.taskSection.duration')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} md={2}>
                                            <FormControl fullWidth>
                                                <TextField type="number" name="nbMinuites"
                                                    value={task.nbMinuites}
                                                    label={translate('microgatewayApp.microprocessTask.nbMinuites')} 
                                                    InputLabelProps={{ shrink: true }}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={2}>
                                            <FormControl fullWidth>
                                                <TextField type="number" name="nbHours"
                                                    value={task.nbHours}
                                                    label={translate('microgatewayApp.microprocessTask.nbHours')} 
                                                    InputLabelProps={{ shrink: true }}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={2}>
                                            <FormControl fullWidth>
                                                <TextField type="number" name="nbDays"
                                                    value={task.nbDays}
                                                    label={translate('microgatewayApp.microprocessTask.nbDays')} 
                                                    InputLabelProps={{ shrink: true }}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <FormControl fullWidth>
                                                <TextField type="number" name="nbMonths"
                                                    value={task.nbMonths}
                                                    label={translate('microgatewayApp.microprocessTask.nbMonths')} 
                                                    InputLabelProps={{ shrink: true }}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <FormControl fullWidth>
                                                <TextField type="number" name="nbYears"
                                                    value={task.nbYears}
                                                    label={translate('microgatewayApp.microprocessTask.nbYears')} 
                                                    InputLabelProps={{ shrink: true }}/>
                                            </FormControl>
                                        </Grid>
                                </Grid>
                        </Box>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        {`${translate('microgatewayApp.microprojectProject.detail.title')} ${project ? ' : '+project.label : ' '}`}
                    </CardActions>
                </Card>
            </Modal>
        </React.Fragment>
    );
}


const mapStateToProps = (storeState: IRootState) => ({
    account: storeState.authentication.account,
  });
  
  const mapDispatchToProps = {
      getSession,
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskDetailModal);