import { ITaskValidationControl } from "app/shared/model/microprocess/task-validation-control.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { Backdrop, Box, Button, Card, CardContent, CardHeader, Checkbox, CircularProgress, colors, FormControlLabel, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Modal, Switch, TextField, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";
import { Close, Edit, Refresh, Send } from "@material-ui/icons";
import { cleanEntity } from "app/shared/util/entity-utils";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '45%',
        boxShadow: 'none',
        background: 'transparent',
        border: 'none',
        marginTop: theme.spacing(4),
        [theme.breakpoints.down('sm')]:{
            width: '95%',
            marginTop: theme.spacing(2),
        }
    },
    cardheader:{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.paper,
        paddingTop:1,
        paddingBottom:1,
        borderRadius: '15px 15px 0 0',
    },
    cardcontent:{
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        minHeigth:'30%',
        maxHeight: '80%',
        overflow: 'auto',
        border: `3px solid ${theme.palette.primary.main}`,
        borderTop: 'none',
        borderRadius: '0 0 15px 15px',
    },
    formBox:{
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 7,
    },
}));

interface TaskValidationControlModalProps{
    task: ITask,
    open?:boolean,
    onClose: Function,
}

export const TaskValidationControlModal = (props: TaskValidationControlModalProps) =>{
    const {task, open} = props;
    
    const classes = useStyles();

    const [formState, setFormState] = useState<ITaskValidationControl>({});

    const [controls, setControls] = useState<ITaskValidationControl[]>([]);

    const [loading, setLoading] = useState(false);

    const initForm = () =>{
        setFormState({
            id: null,
            label: '',
            required: false,
        })
    }

    const getControls = () =>{
        if(task && task.id){
            setLoading(true);
            axios.get<ITaskValidationControl[]>(`${API_URIS.taskValidationControlApi}/?taskId.equals=${task.id}`)
                .then(res =>{
                    if(res.data)
                        setControls([...res.data])
                }).catch((e) =>{
                    /* eslint-disable no-console */
                    console.log(e);
                }).finally(() => setLoading(false));
        }
    }

    useEffect(() =>{
        getControls();
    }, [props.task]);

    const handleChange = (e) =>{
        const {name} = e.target;
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormState({...formState, [name]: value});
    }

    const handleClose = () => props.onClose(controls.filter(c => c.valid).length);

    const handleSave = (event) =>{
        event.preventDefault();
        if(formState && formState.label && task){
            setLoading(true);
            const entity:ITaskValidationControl = {
                ...formState,
                task
            }

            let request: Promise<AxiosResponse<ITaskValidationControl>>;
            if(formState.id)
                request = axios.put<ITaskValidationControl>(`${API_URIS.taskValidationControlApi}`, cleanEntity(entity));
            else
                request = axios.post<ITaskValidationControl>(`${API_URIS.taskValidationControlApi}`, cleanEntity(entity));

            request.then(res =>{
                if(res.data){
                    if(formState.id){
                        setFormState({...res.data})
                        setControls([...controls.map(ctrl => ctrl.id === res.data.id ? res.data : ctrl)]);
                    }
                    else{
                        initForm()
                        setControls([res.data, ...controls]);
                    }
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setLoading(false)) 
        }
    }

    const toggleValid = (control: ITaskValidationControl) =>{
        if(control && control.id){
            setLoading(true);
            control.valid = !control.valid;
            axios.put<ITaskValidationControl>(`${API_URIS.taskValidationControlApi}`, cleanEntity(control))
            .then(res =>{
                if(res.data){
                    setControls([...controls.map(ctrl => ctrl.id === res.data.id ? res.data : ctrl)]);
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setLoading(false)) 
        }
    }

    return (
        <React.Fragment>
            <Modal
                open={open}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout:300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        title={
                            <Typography variant="h4">
                                {translate("microgatewayApp.microprocessTaskValidationControl.home.title")}
                            </Typography>
                        }
                        subheader={
                            <Box width={1} textAlign="center" style={{ color: colors.grey[200]}}>
                                <Typography variant="caption">
                                    {`${translate("microgatewayApp.microprocessTask.detail.title")} :  ${task.name}`}
                                </Typography>
                            </Box>
                        }
                        action={
                            <IconButton title="close" color="inherit" onClick={handleClose}>
                                <Close />
                            </IconButton>
                        }
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        {/* from box */}
                         <Box width={1} display="flex" justifyContent="center" 
                            alignItems="center" p={1} className={classes.formBox}>
                             {formState.id &&
                                <IconButton title="refresh" color="secondary" onClick={initForm}>
                                    <Refresh />
                                </IconButton> 
                            }
                             <Box flexGrow={1} marginRight={1}>
                                <TextField fullWidth
                                    name="label"
                                    value={formState.label}
                                    label={translate("microgatewayApp.microprocessTaskValidationControl.label")}
                                    variant="outlined"
                                    size="small"
                                    onChange={handleChange}
                                />
                             </Box>
                             <FormControlLabel className="mr-2"
                                label={translate("microgatewayApp.microprocessTaskValidationControl.required")}
                                control={<Checkbox checked={formState.required} name="required" onChange={handleChange}  color="primary" />}
                                labelPlacement="start"
                              />
                              <Button  color="primary"
                                disabled={!formState.label}
                                size="small"
                                variant="contained"
                                onClick={handleSave}
                                endIcon={<Send/>}
                                >
                                  {formState.id ? translate("entity.action.edit") : translate("entity.action.save")}&nbsp;
                                </Button>
                         </Box>
                        {/* end form box */}
                        {loading && 
                        <Box width={1} textAlign="center">
                            <CircularProgress /><br/><br/>
                            <Button>Loading...</Button>
                        </Box> }
                        {/* list box */ controls && 
                            <Box width={1} marginTop={1}>
                                <List>
                                    {controls.map(ctrl =>(
                                        <ListItem key={ctrl.id}>
                                            <ListItemText primary={ctrl.label} 
                                                secondary={ctrl.required ? <Typography variant="caption" color="primary">
                                                    {translate("microgatewayApp.microprocessTaskValidationControl.required")}
                                                </Typography> : ''}
                                            />
                                            <ListItemSecondaryAction>
                                                <Box>
                                                    <IconButton color="primary" size="small" onClick={() => setFormState(ctrl)}>
                                                        <Edit />
                                                    </IconButton> &nbsp;&nbsp;
                                                    <FormControlLabel
                                                        control={<Switch checked={ctrl.valid} color="primary" onChange={() => toggleValid(ctrl)} />}
                                                        label={ctrl.valid ? translate("userManagement.activated") : translate("userManagement.deactivated")}
                                                    />
                                                </Box>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        }
                        {/* not found box */}
                        {!loading && (!controls || controls.length === 0) &&
                        <Box width={1} overflow="auto" marginTop={2} textAlign="center">
                            <Typography color="textPrimary">
                                {translate("microgatewayApp.microprocessTaskValidationControl.home.notFound")}
                            </Typography>
                        </Box> }
                    </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default TaskValidationControlModal;