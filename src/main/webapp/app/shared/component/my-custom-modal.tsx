import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, Modal, Slide, SlideProps, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
    },
    card:{
        background: "transparent",
        boxShadow: 'none',
        minWidth: '30%',
        maxWidth: '90%',
        [theme.breakpoints.down('sm')]:{
            minWidth: '80%',
            maxWidth: '80%',
        }
    },
    cardHeader:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        borderRadius: '25px 25px 0 0',
    },
    cardContent:{
        backgroundColor: theme.palette.background.paper,
        minHeight: '5vh',
        maxHeight: '65vh',
        overflow: 'auto',
    },
    cardActions: {
        borderRadius: '0 0 25px 25px',
        backgroundColor: theme.palette.background.paper,
        margin:0,
    }
}))

interface MyCustomModalProps{
    open?: boolean,
    title?: string | React.ReactNode,
    avatarIcon?:any,
    rootCardClassName?:any,
    headerClassName?:string,
    foolterClassName?: string,
    customCardContentClassName?: string,
    slideProps?: SlideProps,
    customActionButtons?: any,
    children?:any,
    footer?: React.ReactNode,
    subheader?: React.ReactNode,
    onClose?: Function,
}

export const MyCustomModal = (props: MyCustomModalProps)=>{
    const { open } = props;
    
    const classes = useStyles();
    const handleClose = () => props.onClose ? props.onClose() : () => {};
    return (
        <React.Fragment>
        <Modal open={open} onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
            disableBackdropClick
            className={classes.modal}>
                <Slide in={open} {...props.slideProps}>
                    <Card className={clsx(classes.card, { [props.rootCardClassName]: props.rootCardClassName })}>
                        <CardHeader
                            title={<Box display="flex" alignItems="center">
                            {props.avatarIcon || <></>}
                            {props.title && <>
                                { typeof props.title === "string" ? (
                                    <Typography variant="h4" className={props.avatarIcon ? 'ml-2' : ''}>
                                        {props.title}
                                    </Typography>
                                )  : props.title }
                            </>
                            }
                        </Box>
                        }
                        subheader={props.subheader || <></>}
                        action={(props.customActionButtons || props.onClose) ?
                            <Box display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                                {props.customActionButtons || <></>}
                                {props.onClose &&
                                <IconButton onClick={handleClose} color="inherit">
                                    <Close />
                                </IconButton>}
                            </Box> : <></>
                        }
                        classes={{ root: clsx(classes.cardHeader, {[props.headerClassName]: props.headerClassName}) }}
                        />
                        <CardContent classes={{ root: clsx(classes.cardContent, { [props.customCardContentClassName] : props.customCardContentClassName}) }}>
                            {props.children}
                        </CardContent>
                        <CardActions className={clsx(classes.cardActions, { [props.foolterClassName]: props.foolterClassName})}>
                            {props.footer}
                        </CardActions>
                    </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}

export default MyCustomModal;