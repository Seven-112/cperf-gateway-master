import { Backdrop, Box, Card, CardContent, CardHeader, Fab, Fade, IconButton, makeStyles, Modal, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import JustificationContainer from "./justfication-container";
import CloseIcon from '@material-ui/icons/Close';
import { Translate } from "react-jhipster";
import { Add } from "@material-ui/icons";
import { ITask } from "app/shared/model/microprocess/task.model";
import { IProcess } from "app/shared/model/microprocess/process.model";
import { JustifcationReason } from "app/shared/model/enumerations/justifcation-reason.model";

 const useStyles = makeStyles(theme =>({
    modal: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.common.white,
        border: '2px solid '+theme.palette.primary.main,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(0, 0, 3),
    },
    cardHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    subheader:{
        color: theme.palette.grey[300],
        textAlign: 'center',
    },
    cardContent:{
        width: theme.spacing(100),
        maxHeight: theme.spacing(70),
        overflow: 'auto',
    }
}));

export interface JustificationModalProps{
    task: ITask,
    process: IProcess,
    reason: JustifcationReason,
    open?: boolean,
    onClose: Function,
}

export const JustificationModal = (props: JustificationModalProps) =>{
    const {open, process} = props;
    const [task, setTask] = useState(props.task);
    const [reason, setReason] = useState(props.reason);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const classes = useStyles();

    useEffect(() =>{
        setTask(props.task)
    }, [props.task])

    useEffect(() =>{
        setReason(props.reason)
    }, [reason])

    const handleClose = () => props.onClose(); 

    return (
    <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    className={classes.modal}
    open={open}
    onClose={handleClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
        timeout: 100,
    }}
    >
        <Card className={classes.paper}>
            <CardHeader className={classes.cardHeader} classes={{ subheader: classes.subheader }}
            title={<Translate contentKey="microgatewayApp.microprocessJustification.home.title"></Translate>}
            action={
                <IconButton aria-label="close" onClick={handleClose}>
                <CloseIcon style={{ color: 'white' }} />
                </IconButton>
            }
            subheader={
                <React.Fragment>
                {task && <Typography variant="h5">
                    <Translate contentKey="microgatewayApp.microprocessTask.detail.title"></Translate>&nbsp;:&nbsp;
                    {task.name}
                  </Typography>
                }
                {process && <Typography variant="h5">
                    <Translate contentKey="microgatewayApp.microprocessProcess.detail.title"></Translate>&nbsp;:&nbsp;
                    {process.label}
                  </Typography>
                }
                </React.Fragment>
            }/>
            <CardContent className={classes.cardContent}>
                 <Box width={1} textAlign="center" boxShadow={2}>
                    <Translate contentKey="_global.label.cause"></Translate>&nbsp;:&nbsp;
                    <Translate contentKey={'_global.justificationReason.'+reason.toString()}></Translate>
                    <Fab color="primary" onClick={() => setOpenUpdateModal(true)} 
                        size="small" className="float-right" style={{}}>
                        <Add />
                    </Fab>
                 </Box>
                <JustificationContainer process={process} task={task} reason={reason} 
                    openUpdateModal={openUpdateModal} onCloseUpdateModal={() =>setOpenUpdateModal(false)}/>
            </CardContent>
        </Card>
    </Modal>
 );
}

export default JustificationModal;