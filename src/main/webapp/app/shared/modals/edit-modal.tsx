import { Backdrop, Card, CardContent, CardHeader, Fade, IconButton, makeStyles, Modal } from '@material-ui/core';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
export interface EditModalProps{
    title?: any,
    body?: any,
    handleClose?: Function,
}
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
}));

const EditModal = forwardRef((props : EditModalProps, ref) =>{
    const classes = useStyles();
    const [open,setOpen] = useState(false); 

    const handleClose = () => {
        setOpen(false);
        if(props.handleClose)
            props.handleClose();
    }

    useImperativeHandle(
        ref,
        () =>({ 
            handleOpen(){
                setOpen(true);
            }
        })
    )
    return (
        <Modal ref={ref}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
        >
        <Fade in={open}>
            <Card className={classes.paper}>
                <CardHeader className={classes.cardHeader}
                title={props.title ? props.title : ''}
                action={
                    <IconButton aria-label="close" onClick={ () => handleClose()}>
                    <CloseIcon style={{ color: 'white' }} />
                    </IconButton>
                }/>
                <CardContent>
                    { props.body }
                </CardContent>
            </Card>
        </Fade>
        </Modal>
    );
})
export default EditModal;