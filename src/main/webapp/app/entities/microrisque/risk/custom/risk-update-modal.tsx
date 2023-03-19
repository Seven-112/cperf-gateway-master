import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { ITask } from "app/shared/model/microprocess/task.model";
import { IRisk } from "app/shared/model/microrisque/risk.model";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import RiskUpdate from "./risk-update";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        boxShadow: 'none',
        background: 'transparent',
        border: '0',
        marginTop: theme.spacing(5),
        width: '50%',
    },
    cardHeader:{
        background: theme.palette.primary.main,
        paddingTop:2,
        paddingBottom:0,
        borderRadius: '7px 7px 0 0',
        color: theme.palette.background.paper,
    },
    cardContent:{
        background: theme.palette.background.paper,
        maxHeight: '80%',
        overflow: 'auto',
    },
    caractions:{
        background: theme.palette.background.paper,
        padding: 0,
        borderRadius: '0 0 7px 7px',
    }
}))

interface RiskUpdateModalProps{
    task?:ITask,
    risk?:IRisk,
    open?:boolean,
    enableEdit?:boolean,
    onSave:Function,
    onClose:Function,
}

export const RiskUpdateModal = (props: RiskUpdateModalProps) =>{
    const {task,open, risk} = props;
    const [step, setStep] = useState(1);

    const classes = useStyles();

    const handleClose = () => props.onClose();

    const handSave = (saved?:IRisk, isNew?: boolean) =>{
        if(saved){
            props.onSave(saved, isNew);
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
                onClose={handleClose}
                className={classes.modal}
                disableBackdropClick
            >
            <Card className={classes.card}>
                <CardHeader 
                    title={translate(`microgatewayApp.microrisqueRisk.home.${risk && risk.id ? 'createOrEditLabel' : 'createLabel'}`)}
                    action={ <IconButton color="inherit" onClick={handleClose}><Close /></IconButton> }
                    className={classes.cardHeader}
                    titleTypographyProps={{
                        variant: 'h4',
                    }}
                />
                <CardContent className={classes.cardContent}>
                     {step <= 1 ? (
                         <RiskUpdate risk={risk} task={task} onSave={handSave} enableEdit={props.enableEdit} />
                     ): ''}
                </CardContent>
                <CardActions className={classes.caractions}>
                    <Box width={1} textAlign="left">
                        
                    </Box>
                </CardActions>
            </Card>
            </Modal>
        </React.Fragment>
    )
}

export default RiskUpdateModal;