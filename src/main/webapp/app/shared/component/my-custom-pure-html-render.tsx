import { Box, BoxProps, makeStyles } from "@material-ui/core";
import theme from "app/theme";
import clsx from "clsx";
import React from "react";
import MyCustomModal from "./my-custom-modal";

const useStyles = makeStyles({
    modal:{
        width: '45%',
        borderRadius:'0px',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
        }
    },
    cardHeader:{
        borderRadius: '5px 5px 0 0',
    },
    cardFooter:{
        borderRadius: '0 0 5px 5px',
    }
})

interface MyCustomPureHtmlRenderProps{
    body?: string,
    renderInSpan?: boolean,
    className?: any,
    boxProps?: BoxProps
}

interface MyCustomPureHtmlRenderModalProps extends MyCustomPureHtmlRenderProps{
    open?: boolean,
    title?: string,
    cardClassName?: string,
    avatarIcon?: any,
    onClose: Function,
}

export const MyCustomPureHtmlRender = (props:MyCustomPureHtmlRenderProps) =>{
    const { body, boxProps, renderInSpan } =props;
    return (
        <React.Fragment>
            {(body && body.length !== 0) && <>
                {renderInSpan ? <span className={props.className} dangerouslySetInnerHTML={{__html: body}} />
                : <Box p={1}  {...boxProps} dangerouslySetInnerHTML={{__html: body}} />}
            </>}
        </React.Fragment>
    );
}


export const MyCustomPureHtmlRenderModal = (props: MyCustomPureHtmlRenderModalProps) =>{
    const { body, boxProps, open } =props;
    
    const classes = useStyles();

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <MyCustomModal
                open={open}
                onClose={handleClose}
                title={props.title || ''}
                avatarIcon={props.avatarIcon}
                headerClassName={classes.cardHeader}
                foolterClassName={classes.cardFooter}
                rootCardClassName={clsx(classes.modal, {[props.cardClassName] : props.cardClassName})}
            >
                <MyCustomPureHtmlRender body={body} boxProps={boxProps} />
            </MyCustomModal>
        </React.Fragment>
    );
}

export default MyCustomPureHtmlRender;