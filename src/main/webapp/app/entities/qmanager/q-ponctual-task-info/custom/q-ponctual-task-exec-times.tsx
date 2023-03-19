import { faSave, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Grid, makeStyles, TextField } from "@material-ui/core";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { SaveButton } from "app/shared/component/custom-button";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { ITask } from "app/shared/model/microprocess/task.model";
import { IQPonctualTaskInfo } from "app/shared/model/qmanager/q-ponctual-task-info.model";
import { IQueryInstance } from "app/shared/model/qmanager/query-instance.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { API_URIS } from "app/shared/util/helpers";
import theme from "app/theme";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { toast } from "react-toastify";

const useStyles = makeStyles({
    card:{
        background: 'transparent',
        minWidth: '35%',
        maxWidth: '35%',
        [theme.breakpoints.down("sm")]:{
            maxWidth: '97%',
        },
        boxShadow: 'none',
        border: 'none',
    },    
})

interface QPonctualTaskExecTimeProps{
    instance: IQueryInstance,
    account: any,
    open: boolean,
    onClose: Function,
}

export const QPonctualTaskExecTime = (props: QPonctualTaskExecTimeProps) =>{
    const { open} = props;

    const [execTimeInfo, setExecTimeInfo] = useState<IQPonctualTaskInfo>({});

    const [task, setTask] = useState<ITask>(null);

    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const canUpdate = props.instance && props.account && props.instance.userId === props.account.id && task && task.id;

    const formIsValid = execTimeInfo && (execTimeInfo.nbMinutes || execTimeInfo.nbHours 
                            || execTimeInfo.nbDays || execTimeInfo.nbMinutes || execTimeInfo.nbYears);

    const getFromProcessManagerService = (execTime: IQPonctualTaskInfo) =>{
        if(props.instance && props.instance.id && serviceIsOnline(SetupService.PROCESS)){
            const apiUri = `${API_URIS.taskApiUri}/getPonctualByQueryId/${props.instance.id}`;
            setLoading(true);
            axios.get<ITask>(apiUri)
                .then(res =>{
                    setTask(res.data);
                    if(res.data){
                        setExecTimeInfo({
                            id: execTime ? execTime.id : null,
                            nbMinutes: res.data.nbMinuites,
                            nbHours: res.data.nbHours,
                            nbDays: res.data.nbDays,
                            nbMonths: res.data.nbMonths,
                            nbYears: res.data.nbYears,
                        })
                    }else{
                        setExecTimeInfo(execTime || {});
                    }
                }).catch(e => console.log(e))
                .finally(() => setLoading(false));
        }else{
            setTask(null);
            setExecTimeInfo(execTime || {});
        }
    }

    const getExecTimeInfo = () =>{
        let apiUri = `${API_URIS.queryPonctualTaskInfoApiUri}/?qInstanceId.equals=${props.instance.id}`;
        apiUri = `${apiUri}&page=${0}&size=${1}&sort=id,desc`;
        setLoading(true);
        axios.get<IQPonctualTaskInfo[]>(apiUri)
            .then(res =>{
                if(res.data && res.data.length !== 0)
                    getFromProcessManagerService(res.data[0]);
                else
                    setExecTimeInfo({});
            }).catch(e => console.log(e))
            .finally(() => setLoading(false));
    }

    useEffect(() =>{
        getExecTimeInfo();
    }, [props.instance])

    const updateTask = (execTime: IQPonctualTaskInfo) =>{
        if(execTime){
            if(task && task.id && serviceIsOnline(SetupService.PROCESS)){
                setLoading(true);
                const entity: ITask = {
                    ...task,
                    nbMinuites: execTime.nbMinutes,
                    nbHours: execTime.nbHours,
                    nbDays: execTime.nbDays,
                    nbMonths: execTime.nbMonths,
                    nbYears: execTime.nbYears,
                }
                axios.put<ITask>(`${API_URIS.taskApiUri}`, cleanEntity(entity))
                    .then(res => {
                        if(res.data){
                            setTask(res.data)
                        }
                    }).catch(e => console.log(e))
                    .finally(() => {
                        setLoading(false);
                        toast.success(`${translate("_global.flash.message.success")}`)
                    })
            }else{
                toast.success(`${translate("_global.flash.message.success")}`)
                setLoading(false);
            }
        }else{
            setLoading(false);
            toast.success(`${translate("_global.flash.message.failed")}`)
        }
    }
    
    const onSave = (event) =>{
        event.preventDefault();
        if(canUpdate && formIsValid){
            setLoading(true);
            const entity: IQPonctualTaskInfo = {
                ...execTimeInfo,
                qInstanceId: props.instance.id,
            }

            const req = execTimeInfo.id ? 
                axios.put<IQPonctualTaskInfo>(`${API_URIS.queryPonctualTaskInfoApiUri}`, cleanEntity(entity))
                : axios.post<IQPonctualTaskInfo>(`${API_URIS.queryPonctualTaskInfoApiUri}`, cleanEntity(entity))
            req.then(res =>{
                updateTask(res.data);
            }).catch(e => console.log(e))
            .finally(() =>{ setLoading(false)})
        }
    }

    const handleChange = (e) =>{
        if(canUpdate){
            const { name, value } = e.target;
            setExecTimeInfo({...execTimeInfo, [name]: value})
        }
    }

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <MyCustomModal 
                open={open}
                onClose={handleClose}
                avatarIcon={<FontAwesomeIcon icon={faStopwatch} />}
                title={translate("_global.label.executionTime")}
                rootCardClassName={classes.card}
            >
                <form onSubmit={onSave}>
                    <Box width={1}>
                        <Grid container justifyContent="center" spacing={2} alignItems="center">
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbMinutes")}
                                    name="nbMinutes"
                                    type="number"
                                    value={execTimeInfo.nbMinutes}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbHours")}
                                    name="nbHours"
                                    type="number"
                                    value={execTimeInfo.nbHours}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbDays")}
                                    name="nbDays"
                                    type="number"
                                    value={execTimeInfo.nbDays}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbMonths")}
                                    name="nbMonths"
                                    type="number"
                                    value={execTimeInfo.nbMonths}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbYears")}
                                    name="nbYears"
                                    type="number"
                                    value={execTimeInfo.nbYears}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    {canUpdate && 
                    <Box width={1} textAlign="right" mt={3}>
                        <SaveButton
                            type="submit"
                            disabled={!formIsValid} 
                        />
                    </Box>}
                </form>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default QPonctualTaskExecTime;