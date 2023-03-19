import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Box, Button, Card, CardContent, CardHeader, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, makeStyles, Modal, Slide, TextField, Typography } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import UserExtraFinder2 from "app/entities/user-extra/custom/user-extra-finder2";
import userExtra from "app/entities/user-extra/user-extra";
import { SaveButton } from "app/shared/component/custom-button";
import MyToast from "app/shared/component/my-toast";
import { ITaskItem } from "app/shared/model/microprocess/task-item.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { API_URIS, getUserExtraFullName } from "app/shared/util/helpers";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '85%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: 'white',
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
    },
    cardcontent:{
      background: 'white',
      minHeight: '20vh',
      maxHeight: '70vh',
      overflow: 'auto',
      borderRadius: '0 0 15px 15px', 
    },
    truncate:{
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }
}))

interface TaskItemUpdateProps{
    taskItem: ITaskItem,
    open?: boolean,
    onSave?: Function,
    onClose: Function,
}

export const TaskItemUpdate = (props: TaskItemUpdateProps) =>{
    const { open } = props;
    const [taskItem, settaskItem] = useState<ITaskItem>(props.taskItem);
    const [isNew, setIsNew] = useState(!props.taskItem || !props.taskItem.id);
    const [openUerFinder, setOpenUserFinder] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        settaskItem(props.taskItem);
        setIsNew(!props.taskItem || !props.taskItem.id);
    }, [props.taskItem])

    const handleClose = () => props.onClose();

    const handleUserFinderChange = (ue?:IUserExtra, selected?: boolean) =>{
        if(userExtra){
            if(selected){
                settaskItem({
                    ...taskItem,
                    checkerId: ue.id,
                    checkerName: getUserExtraFullName(ue),
                    checkerEmail: ue.user ? ue.user.email : null,
                })
            }else{
                settaskItem({
                    ...taskItem,
                    checkerId: null,
                    checkerName: null,
                    checkerEmail: null,
                })
            }
        }
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        setError(false);
        if(taskItem && taskItem.checkerId && taskItem.name && taskItem.checkerName){
            setLoading(true);
            const req = isNew ? axios.post<ITaskItem>(API_URIS.taskItemApiUri, cleanEntity(taskItem))
                                : axios.put<ITaskItem>(API_URIS.taskItemApiUri, cleanEntity(taskItem));
            req.then(res =>{
                if(res.data){
                    settaskItem(res.data)
                    if(props.onSave)
                        props.onSave(res.data, isNew)
                }else{
                    setError(true);
                }
            }).catch(e => console.log(e))
              .finally(() =>{
                  setLoading(false)
              })
        }
    }

    return (
        <React.Fragment>
        <MyToast 
            open={error}
            message={translate(`_global.flash.message.failed`)}
            snackBarProps={{
                autoHideDuration:200,
            }}
            alertProps={{
                color: 'error',
                onClose: () => setError(false),
            }}
        />
        {taskItem && 
        <UserExtraFinder2 
            open={openUerFinder}
            onSelectChange={handleUserFinderChange}
            onClose={() => setOpenUserFinder(false)}
            unSelectableIds={[]}
         />}
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
                <Slide
                        in={open}
                        direction="down"
                        timeout={300}
                    >
                    <Card className={classes.card}>
                        <CardHeader 
                            title={
                                <Box display="flex" alignItems="center">
                                    <FontAwesomeIcon icon={faTasks} />
                                    <Typography variant="h4" className="ml-3">
                                        {translate("microgatewayApp.microprocessTaskItem.home.createOrEditLabel")}
                                    </Typography>
                                </Box>
                            }
                            action={
                                <Box display="flex" alignItems="center">
                                <IconButton 
                                    color="inherit"
                                    onClick={handleClose}>
                                    <Close />
                                </IconButton>
                                </Box>
                            }
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            {loading && <Box width={1} mb={3} display="flex" 
                                    justifyContent="center" alignItems="center" flexWrap="wrap">
                                <CircularProgress style={{ height:30, width:30}} color="secondary"/>
                                <Typography className="ml-2" color="secondary">Loading...</Typography>    
                            </Box>}
                            {taskItem && <Box width={1}>
                                <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            value={taskItem.name}
                                            fullWidth
                                            label={taskItem.name ? '' : translate("microgatewayApp.microprocessTaskItem.name")}
                                            placeholder={translate("microgatewayApp.microprocessTaskItem.name")}
                                            onChange={(e) => settaskItem({...taskItem, name: e.target.value})}
                                         />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            value={taskItem.checkerName}
                                            fullWidth
                                            label={taskItem.checkerName ? '' : translate("microgatewayApp.microprocessTaskItem.checkerName")}
                                            placeholder={translate("microgatewayApp.microprocessTaskItem.checkerName")}
                                            onClick={() => setOpenUserFinder(true)}
                                         />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                                            <Typography className="mr-3">
                                                {translate("microgatewayApp.microprocessTaskItem.required")}
                                            </Typography>
                                            <FormControlLabel
                                                label={translate(`_global.label.${taskItem.required ? 'yes': 'no'}`)}
                                                onChange={() => settaskItem({...taskItem, required: !taskItem.required})}
                                                control={<Checkbox checked={taskItem.required} color="primary" />}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box width={1} display="flex" justifyContent="flex-end" alignItems="center" flexWrap="wrap">
                                            <SaveButton type="submit"
                                                disabled={!taskItem.name || !taskItem.checkerName || !taskItem.checkerId} />
                                        </Box>
                                    </Grid>
                                </Grid>
                                </form>
                            </Box>}
                        </CardContent>
                    </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}

export default TaskItemUpdate;
