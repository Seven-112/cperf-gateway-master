import { Backdrop, Box, Card, CardContent, CardHeader, Fab, IconButton, makeStyles, Modal, Slide, Typography } from "@material-ui/core";
import React from "react";
import { translate } from "react-jhipster";
import { Close } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheckCircle, faExclamation } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        minWidth: '25%',
        maxWidth: '45%',
        [theme.breakpoints.down("sm")]:{
            maxWidth: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: 'white',
        color: theme.palette.secondary.main,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      padding: 30,
      overflow: 'auto',
      borderRadius: '0 0 15px 15px',  
    },
}))

interface ConfirmDialogProps{
    open?: boolean,
    title?:string,
    rootCardCustomClassName?:string,
    question?: string,
    okText?: string,
    cancelText?: string,
    onConfirm: Function,
    onClose:Function,
}

export const ConfirmDialog = (props: ConfirmDialogProps) =>{
    const { open, question, title, okText, cancelText } = props;
    const classes = useStyles();

    const handleClose = () => props.onClose();

    const handleConfirm = () => props.onConfirm();

    return (
        <React.Fragment>
            <Modal
                open={open}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout:300}}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
             >
                 <Slide in={open}>
                    <Card className={clsx(classes.card, {[props.rootCardCustomClassName]: props.rootCardCustomClassName})}>
                        <CardHeader 
                            avatar={<FontAwesomeIcon icon={faExclamation} />}
                            title={title || "Confirmation"}
                            titleTypographyProps={{ variant: 'h4' }}
                            action={<IconButton color="inherit" onClick={handleClose}><Close /></IconButton>}
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            <Box width={1}  display="flex"  flexWrap="wrap"
                                flexDirection="column" overflow="auto" justifyContent="center">
                                    <Typography variant="h3">{question || translate("_global.label.doYouWontToContinue")}</Typography>
                                    <Box display="flex" flexWrap="wrap" overflow="auto" 
                                            justifyContent="center" alignItems="center" mt={5}>
                                        <Fab 
                                            variant="extended"
                                            color="default"
                                            size="medium"
                                            onClick={handleClose}>
                                                <Typography className="mr-2">{cancelText || translate("_global.label.no")}</Typography>
                                                <FontAwesomeIcon icon={faBan} />
                                        </Fab>
                                        <Fab 
                                            variant="extended"
                                            color="secondary"
                                            size="medium"
                                            className="ml-5"
                                            onClick={handleConfirm}>
                                                <Typography className="mr-2">{okText || translate("_global.label.yes")}</Typography>
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                        </Fab>
                                    </Box>
                            </Box>
                        </CardContent>
                    </Card>
                 </Slide>
            </Modal>
        </React.Fragment>
    )
}

export default ConfirmDialog;
