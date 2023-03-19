
import React, { useEffect, useState } from 'react';
import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, colors, FormControl, Grid, IconButton, makeStyles, Modal, TextField, Typography } from '@material-ui/core';
import { IEmployee } from 'app/shared/model/employee.model';
import { ITask } from 'app/shared/model/microprocess/task.model';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import CloseIcon from '@material-ui/icons/Close';
import { IDepartment } from 'app/shared/model/department.model';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import TaskChrono from './task-chrono';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { TaskUserRole } from 'app/shared/model/enumerations/task-user-role.model';
import { ITaskUser } from 'app/shared/model/microprocess/task-user.model';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import TaskDetailToolbar from './task-detail-toolbar';
import {TaskControl} from './tak-control';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';

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

export interface ITaskDetailModalProps extends StateProps, DispatchProps{
    taskId: any,
    open: boolean,
    readonly?:boolean,
    onUpdate?: Function,
    onClose: Function, // necessary if this component called in modal
    onCheckiListChange?: Function,
}

export const TaskDetailModal = (props: ITaskDetailModalProps) =>{

    const [task, setTask] = useState<ITask>({});

    const [tProcess, setTProcess] = useState<IProcess>(null);
    
    const [loading, setLoading] = useState(false);

    const [group, setGroup] = useState<IDepartment>(null);

    const [taskUserRoles, setTaskUserRoles] = useState<TaskUserRole[]>([]);
    const [realodControls, setRealoadControls] = useState(false);

    const getTask = () =>{
        setLoading(true);
        axios.get<ITask>(`${API_URIS.taskApiUri}/${props.taskId}`)
            .then(res =>{
                if(res.data)
                    setTask(res.data);
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{
                setLoading(false);
            })
    }

    const getProcess = () =>{
        if(task && task.id){
            setLoading(true);
            axios.get<IProcess>(`${API_URIS.processApiUri}/${task.processId}`)
                .then(res =>{
                    setTProcess(res.data);
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
            axios.get<ITaskUser[]>(`${API_URIS.taskUserApiUri}/?taskId.equals=${task.id}&userId.equals=${props.account.id}`)
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
                        setTaskUserRoles([...taskUserRoles, TaskUserRole.EXCEUTOR]);
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
        getProcess();
        getDepartment();
        userDepartmentEqualsTaskGroup();
    }, [task]);

    const handleClose = () =>{
        if(props.onClose){
            props.onClose();
        }
    }

    const handleUpdate = (updated?: ITask) =>{
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
    
    const isUserExecutor =  taskUserRoles && taskUserRoles.length > 0 && taskUserRoles.some(item =>item === TaskUserRole.EXCEUTOR);
    const isUserSubmitor =  taskUserRoles && taskUserRoles.length > 0 && taskUserRoles.some(item =>item === TaskUserRole.SUBMITOR);
    const isUserValidor =  taskUserRoles && taskUserRoles.length > 0 && taskUserRoles.some(item =>item === TaskUserRole.VALIDATOR);
    const canUpdate = !props.readonly && props.account && hasPrivileges({entities: ['Process','Task'], actions: [PrivilegeAction.UPDATE]}, props.account.authorities);

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
                            <TaskDetailToolbar 
                             account={props.account} 
                             task={task}tProcess={tProcess} 
                             validor={isUserValidor} executor={isUserExecutor} 
                             submitor={isUserSubmitor} withUpdateBtn={canUpdate}
                             taskInInStance={tProcess !== null && tProcess.modelId !== null}
                             onTaskUpdate={handleUpdate}  onCheckListChane={handleCheckListChange} />
                        </Box>
                        <Box width={1} p={1}>
                                <Grid container spacing={1}>
                                    {tProcess && tProcess.modelId && 
                                    <Grid item xs={12}>
                                        <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                                            <div className="d-inline-block ml-2" style={{ marginTop: '-5px', }}>
                                                <TaskChrono task={task} blankText="" hideActionButton={true} onPlayOrPause={handleUpdate}/>
                                            </div>
                                            <div className="d-inline-block ml-2" style={{ marginTop: '-7px', }}>
                                                <TaskControl
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
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                        <TextField type="text" name="description" 
                                            value={group ? group.name : ''}
                                            label={translate('microgatewayApp.microprocessTask.groupId')}
                                            InputLabelProps={{ shrink: true }}/>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                        <TextField type="text" name="description" 
                                            value={task.type}
                                            label={translate('microgatewayApp.microprocessTask.type')}
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
                                        <TextField type="text" name="description" 
                                            value={task.startWithProcess ? 
                                                    translate("_global.form.selectOptions.taskSection.startWithProcessesOpt") :
                                                    translate("_global.form.selectOptions.taskSection.noStartWithProcessOpt")
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
                        {tProcess &&  <MyCustomPureHtmlRender body={tProcess.label} />}
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailModal);